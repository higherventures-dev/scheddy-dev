// src/app/api/google/oauth/callback/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createAdmin } from "@supabase/supabase-js";

function absolute(req: NextRequest, target: string) {
  // If target is already absolute, keep it; otherwise resolve against current origin
  try { return new URL(target).toString(); } catch {}
  const origin = new URL(req.url).origin;
  return new URL(target, origin).toString();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const rawState = url.searchParams.get("state") ?? "";

  let returnTo = "/dashboard/settings/integrations";
  try {
    const parsed = JSON.parse(Buffer.from(rawState, "base64url").toString("utf8"));
    if (parsed?.returnTo) returnTo = parsed.returnTo;
  } catch {
    try { returnTo = decodeURIComponent(decodeURIComponent(rawState)); } catch {}
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const signin = `/auth/sign-in?next=${encodeURIComponent(returnTo)}`;
      return NextResponse.redirect(absolute(req, signin)); // ✅ absolute URL
    }

    const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    const redirectUri = `${base}/api/google/oauth/callback`;
    const oAuth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri
    );

    if (!code) {
      return NextResponse.redirect(absolute(req, returnTo)); // ✅ absolute URL
    }

    const { tokens } = await oAuth2.getToken(code);
    oAuth2.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2 });
    const { data: me } = await oauth2.userinfo.get();

    const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const { data: existing } = await admin
      .from("google_oauth_tokens")
      .select("refresh_token")
      .eq("user_id", user.id)
      .maybeSingle();

    const refresh_token = tokens.refresh_token ?? existing?.refresh_token ?? "";

    const { error: upsertErr } = await admin
      .from("google_oauth_tokens")
      .upsert({
        user_id: user.id,
        email: me.email!,
        access_token: tokens.access_token!,
        refresh_token,
        token_type: tokens.token_type!,
        scope: tokens.scope!,
        expiry_date: new Date(tokens.expiry_date ?? Date.now()).toISOString(),
        calendar_id: "primary",
        updated_at: new Date().toISOString(),
      });

    if (upsertErr) throw upsertErr;

    return NextResponse.redirect(absolute(req, returnTo)); // ✅ absolute URL
  } catch (e: any) {
    console.error("OAuth callback failed:", e);
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
