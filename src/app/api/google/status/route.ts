import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ connected: false });

  const { data, error } = await supabase
    .from("google_oauth_tokens")
    .select("email, calendar_id, expiry_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ connected: false, error: error.message });

  return NextResponse.json(
    data
      ? { connected: true, email: data.email, calendarId: data.calendar_id, expiry: data.expiry_date }
      : { connected: false }
  );
}
