import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export async function getGoogleClientForUser(user_id: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: row, error } = await supabase
    .from("google_oauth_tokens")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error || !row) throw new Error("Google not connected.");

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/oauth/callback`
  );

  oAuth2Client.setCredentials({
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    scope: row.scope,
    token_type: row.token_type,
    expiry_date: new Date(row.expiry_date).getTime(),
  });

  oAuth2Client.on("tokens", async (tokens) => {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (tokens.access_token) updates.access_token = tokens.access_token;
    if (tokens.refresh_token) updates.refresh_token = tokens.refresh_token;
    if (tokens.expiry_date)  updates.expiry_date  = new Date(tokens.expiry_date).toISOString();
    await supabase.from("google_oauth_tokens").update(updates).eq("user_id", user_id);
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  return { calendar, calendar_id: row.calendar_id as string };
}
