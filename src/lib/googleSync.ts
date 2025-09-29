import { getGoogleClientForUser } from "./googleClient";
import { createClient } from "@supabase/supabase-js";

export type GoogleUpsertArgs = {
  appt_id: string;
  user_id: string;           // staff user who owns the calendar
  title: string;
  description?: string;
  location?: string;
  startISO: string;          // "2025-09-17T10:00:00"
  endISO: string;            // "2025-09-17T11:00:00"
  timeZone: string;          // "America/Los_Angeles"
  attendees?: { email: string; optional?: boolean }[];
  remindersMins?: number[];  // e.g., [30, 10]
};

export async function upsertGoogleEvent(args: GoogleUpsertArgs) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { calendar, calendar_id } = await getGoogleClientForUser(args.user_id);

  const { data: map } = await supabase
    .from("appointment_google_events")
    .select("*")
    .eq("appt_id", args.appt_id)
    .maybeSingle();

  const requestBody: any = {
    summary: args.title,
    description: args.description ?? "",
    location: args.location ?? "",
    start: { dateTime: args.startISO, timeZone: args.timeZone },
    end:   { dateTime: args.endISO,   timeZone: args.timeZone },
    attendees: (args.attendees ?? []).map(a => ({ email: a.email, optional: !!a.optional })),
    reminders: args.remindersMins?.length
      ? { useDefault: false, overrides: args.remindersMins.map(m => ({ method: "popup", minutes: m })) }
      : { useDefault: true },
    extendedProperties: { private: { scheddyId: args.appt_id } },
    transparency: "opaque",
  };

  const res = map?.google_event_id
    ? await calendar.events.update({ calendarId: calendar_id, eventId: map.google_event_id, requestBody })
    : await calendar.events.insert({ calendarId: calendar_id, requestBody, supportsAttachments: false });

  const event = res.data;
  await supabase.from("appointment_google_events").upsert({
    appt_id: args.appt_id,
    user_id: args.user_id,
    google_event_id: event.id!,
    ical_uid: event.iCalUID ?? null,
    last_synced_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function deleteGoogleEvent(appt_id: string, user_id: string) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: map } = await supabase
    .from("appointment_google_events")
    .select("*")
    .eq("appt_id", appt_id)
    .maybeSingle();

  if (!map?.google_event_id) {
    // nothing to delete; ensure mapping is gone
    await supabase.from("appointment_google_events").delete().eq("appt_id", appt_id);
    return;
  }

  const { calendar, calendar_id } = await getGoogleClientForUser(user_id);
  await calendar.events.delete({ calendarId: calendar_id, eventId: map.google_event_id });

  await supabase.from("appointment_google_events").delete().eq("appt_id", appt_id);
}
