import 'server-only';

import { google, calendar_v3 } from 'googleapis';
import { supabaseAdmin } from '@/utils/supabase/admin';

// ---------------- Types ----------------
export type ScheddyStatus =
  | 'Unconfirmed'
  | 'Confirmed'
  | 'No-show'
  | 'Canceled'
  | 'Completed';

export interface Booking {
  id: string;
  user_id: string; // artist/owner in Supabase (who authorized Google)
  title: string;
  description?: string | null;
  location?: string | null;
  starts_at: string; // ISO 8601
  ends_at: string;   // ISO 8601
  timezone?: string | null; // IANA tz
  status: ScheddyStatus;
  customer_email?: string | null;
  customer_name?: string | null;
}

// ---------------- Auth (per user) ----------------
async function getOAuth2ForUser(userId: string) {
  const { data: row, error } = await supabaseAdmin
    .from('google_oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!row) throw new Error('Google not connected');

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  oauth2.setCredentials({
    refresh_token: row.refresh_token,
    access_token: row.access_token,
    expiry_date: row.expiry_date ? new Date(row.expiry_date).getTime() : undefined,
  });

  // Persist refreshed tokens
  oauth2.on('tokens', async (t) => {
    try {
      await supabaseAdmin
        .from('google_oauth_tokens')
        .update({
          access_token: t.access_token ?? row.access_token,
          refresh_token: t.refresh_token ?? row.refresh_token,
          expiry_date: t.expiry_date ? new Date(t.expiry_date).toISOString() : row.expiry_date,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (e) {
      console.error('Failed to persist refreshed Google tokens', e);
    }
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });
  const calendarId: string = row.calendar_id || 'primary';
  return { calendar, calendarId };
}

// ---------------- Base event build ----------------
export function buildEventResource(b: Booking): calendar_v3.Schema$Event {
  const tz = b.timezone || 'UTC';

  const summary = b.title || 'Appointment';
  const descriptionLines = [
    b.description || '',
    `— Scheddy Booking #${b.id}`,
    b.customer_name ? `Client: ${b.customer_name}` : '',
  ].filter(Boolean);

  const event: calendar_v3.Schema$Event = {
    summary,
    description: descriptionLines.join('\n'),
    location: b.location || undefined,
    start: { dateTime: b.starts_at, timeZone: tz },
    end:   { dateTime: b.ends_at,   timeZone: tz },
    transparency: 'opaque', // default Busy; can be overridden per status
    visibility: 'default',
    source: { title: 'Scheddy', url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${b.id}` },
    extendedProperties: {
      private: {
        scheddyBookingId: b.id,
        scheddyStatus: b.status,
      },
    },
  };

  if (b.customer_email) {
    event.attendees = [{
      email: b.customer_email,
      displayName: b.customer_name || undefined,
    }];
  }

  event.reminders = {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 24 * 60 },
      { method: 'popup', minutes: 30 },
    ],
  };

  return event;
}

// ---------------- Status → Google patch ----------------
// Toggle whether canceled events still block time.
const CANCEL_FREES_TIME = true;

// Your hex → closest Google colorId
// #969696 (gray)  → '8'
// #69AADE (blue)  → '9'
// #E5C26A (yellow)→ '5'
// #FF5C66 (red)   → '11'
// #80CF93 (green) → '10'
export function statusPatch(status: ScheddyStatus): Partial<calendar_v3.Schema$Event> {
  const COLORS = { GRAY: '8', BLUE: '9', YELLOW: '5', RED: '11', GREEN: '10' } as const;

  switch (status) {
    case 'Unconfirmed':
      return {
        status: 'tentative',
        colorId: COLORS.GRAY,
        transparency: 'opaque',
        extendedProperties: { private: { scheddyStatus: 'Unconfirmed' } },
      };
    case 'Confirmed':
      return {
        status: 'confirmed',
        colorId: COLORS.BLUE,
        transparency: 'opaque',
        extendedProperties: { private: { scheddyStatus: 'Confirmed' } },
      };
    case 'No-show':
      return {
        status: 'tentative',
        colorId: COLORS.YELLOW,
        transparency: 'opaque',
        extendedProperties: { private: { scheddyStatus: 'NoShow' } },
      };
    case 'Completed':
      // Google has no "completed" state → keep confirmed + green
      return {
        status: 'confirmed',
        colorId: COLORS.GREEN,
        transparency: 'opaque',
        extendedProperties: { private: { scheddyStatus: 'Completed' } },
      };
    case 'Canceled':
      // Keep visible & turn red; optionally Free (transparent)
      return {
        status: 'confirmed', // not "cancelled" (that hides/removes)
        colorId: COLORS.RED,
        transparency: CANCEL_FREES_TIME ? 'transparent' : 'opaque',
        extendedProperties: { private: { scheddyStatus: 'Canceled' } },
      };
  }
}

// ---------------- Mapping table ----------------
async function getMapping(bookingId: string) {
  const { data } = await supabaseAdmin
    .from('google_events')
    .select('booking_id,user_id,calendar_id,event_id,etag')
    .eq('booking_id', bookingId)
    .maybeSingle();
  return data || null;
}

async function upsertMapping(
  bookingId: string,
  userId: string,
  calendarId: string,
  event: calendar_v3.Schema$Event
) {
  await supabaseAdmin
    .from('google_events')
    .upsert({
      booking_id: bookingId,
      user_id: userId,
      calendar_id: calendarId,
      event_id: event.id!,
      etag: event.etag || null,
      updated_at: new Date().toISOString(),
    });
}

// ---------------- CRUD helpers ----------------
/** Create a Google event for a booking. Returns eventId. */
export async function createGoogleEvent(userId: string, booking: Booking): Promise<string> {
  const { calendar, calendarId } = await getOAuth2ForUser(userId);
  const base = buildEventResource(booking);
  const patch = statusPatch(booking.status);

  const { data: event } = await calendar.events.insert({
    calendarId,
    requestBody: { ...base, ...patch },
    sendUpdates: booking.customer_email ? 'all' : 'none',
  });

  if (!event.id) throw new Error('Google event missing id');
  await upsertMapping(booking.id, userId, calendarId, event);
  return event.id;
}

/** Update an existing Google event for a booking (or create if missing). */
export async function updateGoogleEvent(userId: string, booking: Booking): Promise<string> {
  const mapping = await getMapping(booking.id);
  if (!mapping?.event_id) {
    return createGoogleEvent(userId, booking);
  }

  const { calendar } = await getOAuth2ForUser(userId);
  const base = buildEventResource(booking);
  const patch = statusPatch(booking.status);

  const { data: event } = await calendar.events.update({
    calendarId: mapping.calendar_id,
    eventId: mapping.event_id,
    requestBody: { ...base, ...patch },
    sendUpdates: booking.customer_email ? 'all' : 'none',
  });

  if (!event?.id) {
    return createGoogleEvent(userId, booking);
  }

  await upsertMapping(booking.id, userId, mapping.calendar_id, event);
  return mapping.event_id;
}

/** Optional hard delete (kept for explicit admin actions). */
export async function deleteGoogleEvent(userId: string, bookingId: string): Promise<void> {
  const mapping = await getMapping(bookingId);
  if (!mapping?.event_id) return;

  const { calendar } = await getOAuth2ForUser(userId);
  try {
    await calendar.events.delete({
      calendarId: mapping.calendar_id,
      eventId: mapping.event_id,
      sendUpdates: 'all',
    });
  } finally {
    await supabaseAdmin.from('google_events').delete().eq('booking_id', bookingId);
  }
}

/** Idempotent convenience: always upsert (Canceled = red, not deleted). */
export async function syncGoogleForBooking(userId: string, booking: Booking) {
  const eventId = await updateGoogleEvent(userId, booking);
  return { action: 'upserted' as const, eventId };
}
