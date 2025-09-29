// src/lib/google/calendar.ts
import { google, calendar_v3 } from "googleapis";
import { supabaseAdmin } from "@/utils/supabase/admin"; // service role client

type TokensRow = {
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  expiry_date: string;
  calendar_id: string;
};

export async function getOAuth2ForUser(userId: string) {
  const { data: row, error } = await supabaseAdmin
    .from("google_oauth_tokens")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!row) throw new Error("Google not connected");

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  // Prefer using refresh_token to always get a fresh access token
  oauth2.setCredentials({
    refresh_token: row.refresh_token,
    access_token: row.access_token,
    expiry_date: new Date(row.expiry_date).getTime()
  });

  // When googleapis refreshes, persist the new tokens
  oauth2.on("tokens", async (t) => {
    try {
      // Keep old refresh_token if Google didn't send a new one
      const refresh_token = t.refresh_token ?? row.refresh_token;
      const access_token = t.access_token ?? row.access_token;
      const expiry_date = t.expiry_date ? new Date(t.expiry_date).toISOString() : row.expiry_date;

      await supabaseAdmin
        .from("google_oauth_tokens")
        .update({ access_token, refresh_token, expiry_date, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } catch (e) {
      console.error("Failed to persist refreshed Google tokens", e);
    }
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2 });
  return { calendar, tokens: row as TokensRow };
}

/** Normalize your appointment into a Google Calendar event resource */
export function buildEventResource(booking: {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  // ISO strings in UTC or with tz offset:
  starts_at: string;
  ends_at: string;
  // If you track a time zone per artist/user, pass it in; otherwise set a default
  timezone?: string; // e.g. "America/Los_Angeles"
  customer_name?: string | null;
}) : calendar_v3.Schema$Event {
  const timeZone = booking.timezone || "UTC";
  const summary = booking.title || `Appointment`;
  const description =
    (booking.description ?? "") +
    `\n\n— Scheddy Booking #${booking.id}` +
    (booking.customer_name ? `\nClient: ${booking.customer_name}` : "");

  return {
    summary,
    description,
    location: booking.location || undefined,
    start: { dateTime: booking.starts_at, timeZone },
    end:   { dateTime: booking.ends_at,   timeZone },
    source: { title: "Scheddy", url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${booking.id}` },
    // optional reminders/display options…
  };
}
