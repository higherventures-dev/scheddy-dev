// src/lib/google/sync.ts
export const runtime = "nodejs"; // Important anywhere googleapis is used

import { getOAuth2ForUser, buildEventResource } from "./calendar";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { calendar_v3 } from "googleapis";

/** Create a Google event for a booking and store the mapping */
export async function googleCreateEventForBooking(userId: string, booking: any) {
  const { calendar, tokens } = await getOAuth2ForUser(userId);
  const resource = buildEventResource(booking);
  const calendarId = tokens.calendar_id || "primary";

  try {
    const { data: event } = await calendar.events.insert({
      calendarId,
      requestBody: resource,
    });

    if (!event.id) throw new Error("Google event missing id");

    await upsertMapping(booking.id, userId, calendarId, event);
    return event.id!;
  } catch (e: any) {
    handleGoogleError(e, userId);
  }
}

/** Update or create if missing (idempotent) */
export async function googleUpsertEventForBooking(userId: string, booking: any) {
  const mapping = await getMapping(booking.id);

  if (!mapping?.event_id) {
    return googleCreateEventForBooking(userId, booking);
  }

  const { calendar } = await getOAuth2ForUser(userId);
  const resource = buildEventResource(booking);

  try {
    const { data: event } = await calendar.events.update({
      calendarId: mapping.calendar_id,
      eventId: mapping.event_id,
      requestBody: resource,
    });

    await upsertMapping(booking.id, userId, mapping.calendar_id, event);
    return mapping.event_id;
  } catch (e: any) {
    // If not found (deleted on Google), recreate
    if (isNotFound(e)) {
      return googleCreateEventForBooking(userId, booking);
    }
    handleGoogleError(e, userId);
  }
}

/** Delete event when booking is deleted/cancelled */
export async function googleDeleteEventForBooking(userId: string, bookingId: string) {
  const mapping = await getMapping(bookingId);
  if (!mapping?.event_id) return;

  const { calendar } = await getOAuth2ForUser(userId);
  try {
    await calendar.events.delete({
      calendarId: mapping.calendar_id,
      eventId: mapping.event_id,
    });
  } catch (e: any) {
    if (!isNotFound(e)) handleGoogleError(e, userId);
  } finally {
    await supabaseAdmin.from("google_events").delete().eq("booking_id", bookingId);
  }
}

// -------------- internals --------------

async function getMapping(booking_id: string) {
  const { data } = await supabaseAdmin
    .from("google_events")
    .select("booking_id,user_id,calendar_id,event_id,etag")
    .eq("booking_id", booking_id)
    .maybeSingle();
  return data || null;
}

async function upsertMapping(booking_id: string, user_id: string, calendar_id: string, event: calendar_v3.Schema$Event) {
  await supabaseAdmin
    .from("google_events")
    .upsert({
      booking_id,
      user_id,
      calendar_id,
      event_id: event.id!,
      etag: event.etag || null,
      updated_at: new Date().toISOString(),
    });
}

function isNotFound(e: any) {
  const code = e?.code || e?.response?.status;
  return code === 404;
}

function handleGoogleError(e: any, userId: string): never {
  const status = e?.response?.status;
  const err = String(e?.message || e);
  // If refresh token is revoked/expired, surface a “reconnect” signal
  if (status === 401 || /invalid_grant|unauthorized/i.test(err)) {
    throw new Error("GOOGLE_RECONNECT_REQUIRED");
  }
  throw e;
}
