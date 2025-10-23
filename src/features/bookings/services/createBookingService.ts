// features/bookings/services/createBookingService.ts
'use server';

import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { sendBookingRequestEmail } from '@/features/bookings/services/sendBookingRequestEmail';
import { createClientService } from '@/features/clients/services/createClientService';
import { syncGoogleForBooking } from '@/lib/google/bookingSync';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string; details?: string | null; hint?: string | null };

const TZ_DEFAULT = 'America/Los_Angeles'; // set to your app default or per-artist tz

function toPlainError(e: any): ActionResult<never> {
  return {
    ok: false,
    error: e?.message ?? e?.error_description ?? String(e),
    code: e?.code,
    details: e?.details ?? null,
    hint: e?.hint ?? null,
  };
}

function logError(prefix: string, e: any) {
  try {
    console.error(prefix, e, JSON.stringify(e, Object.getOwnPropertyNames(e)));
  } catch {
    console.error(prefix, e);
  }
}

// Accepts "02:00 PM", "2:00 pm", "14:00", etc. -> "HH:MM:SS"
function to24h(t12: string) {
  const raw = (t12 ?? '').trim();
  if (!raw) return '09:00:00'; // default
  // Already 24h "HH:MM"
  const m24 = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m24) return `${m24[1].padStart(2, '0')}:${m24[2]}:00`;
  // 12h with AM/PM
  const m12 = raw.toUpperCase().match(/^(\d{1,2}):([0-5]\d)\s*([AP])\.?M?\.?$/);
  if (m12) {
    let hh = parseInt(m12[1], 10);
    const mm = m12[2];
    const ap = m12[3];
    if (ap === 'A') { if (hh === 12) hh = 0; }
    else { if (hh !== 12) hh += 12; }
    return `${String(hh).padStart(2, '0')}:${mm}:00`;
  }
  // fallback with minutes defaulted
  const short12 = raw.toUpperCase().match(/^(\d{1,2})\s*([AP])\.?M?\.?$/);
  if (short12) {
    let hh = parseInt(short12[1], 10);
    const ap = short12[2];
    if (ap === 'A') { if (hh === 12) hh = 0; }
    else { if (hh !== 12) hh += 12; }
    return `${String(hh).padStart(2, '0')}:00:00`;
  }
  // if nothing matched, keep raw; caller will validate
  return raw;
}

function statusNumberToText(n?: number) {
  switch (n) {
    case 2: return 'Confirmed';
    case 3: return 'No-show';
    case 4: return 'Canceled';
    case 5: return 'Completed';
    default: return 'Unconfirmed';
  }
}

export async function createBooking(data: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  notes: string;
  service_id: string;
  title: string;
  price: number;
  status: number;            // 1..5 (Unconfirmed..Completed)
  studio_id?: string;
  artist_id: string;         // the ARTIST who owns the calendar
  client_id?: string;
  user_id?: string;          // creator (artist or customer)
  selected_date?: string;    // 'YYYY-MM-DD' or ISO
  selected_time?: string;    // '02:00 PM' or '14:00'
  timezone?: string;         // optional; default TZ_DEFAULT
}): Promise<ActionResult<any>> {
  try {
    const supa = createServerActionClient({ cookies });

    // 0) Basic validation
    if (!data.artist_id) return { ok: false, error: 'Missing artist_id' };
    if (!data.title)     return { ok: false, error: 'Missing title' };

    // 1) Get or create client
    let client_id = data.client_id;
    if (!client_id) {
      try {
        client_id = await createClientService({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          email_address: data.email_address,
          artist_id: data.artist_id,
          studio_id: data.studio_id,
        });
      } catch (e: any) {
        logError('[createBooking] createClientService error:', e);
        return toPlainError(e);
      }
    }

    // 2) Combine date + time → local Date → ISO (UTC)
    const artistTz = data.timezone || TZ_DEFAULT;
    const datePart = (data.selected_date ?? new Date().toISOString()).split('T')[0]; // YYYY-MM-DD
    const hhmmss = to24h(data.selected_time ?? '09:00 AM');
    const startLocal = new Date(`${datePart}T${hhmmss}`);
    if (isNaN(startLocal.getTime())) return { ok: false, error: 'Invalid start time' };

    const DEFAULT_DURATION_MIN = 60;
    const endLocal = new Date(startLocal.getTime() + DEFAULT_DURATION_MIN * 60 * 1000);

    const starts_at_iso = startLocal.toISOString();
    const ends_at_iso   = endLocal.toISOString();
    if (endLocal <= startLocal) return { ok: false, error: 'End must be after start' };

    // 3) Pull profile toggles + preferred calendar
    const { data: profile, error: profErr } = await supa
      .from('profiles')
      .select('automatic_booking_confirmations, google_calendar_id')
      .eq('id', data.artist_id)
      .maybeSingle();

    if (profErr) {
      logError('[createBooking] profile load error:', profErr);
      // Non-fatal; continue with provided status
    }

    let bookingStatusCode = data.status ?? 1; // default Unconfirmed
    if (profile?.automatic_booking_confirmations === true) bookingStatusCode = 2; // Confirmed

    // 4) Insert booking
    const insertPayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      email_address: data.email_address,
      notes: data.notes,
      service_id: data.service_id,
      title: data.title,
      price: data.price,
      status: bookingStatusCode,        // numeric in DB
      studio_id: data.studio_id ?? null,
      artist_id: data.artist_id,
      client_id: client_id,             // computed client id
      user_id: data.user_id ?? null,
      start_time: starts_at_iso,        // timestamptz
      end_time: ends_at_iso,            // timestamptz
      timezone: artistTz,               // text (IANA tz)
    };

    const { data: inserted, error: insertError } = await supa
      .from('bookings')
      .insert([insertPayload])
      .select('*')
      .single();

    if (insertError) {
      logError('[createBooking] insert error:', insertError);
      return toPlainError(insertError);
    }

    const booking = inserted;

    // 5) Google Calendar sync FIRST (so email failures don't block it)
    try {
      const calendarId = profile?.google_calendar_id || 'primary';
      console.log('[GoogleSync] start', { bookingId: booking.id, artistId: booking.artist_id, calendarId });

      await syncGoogleForBooking(booking.artist_id, {
        id: booking.id,
        user_id: booking.artist_id,                // the ARTIST who connected Google
        calendar_id: calendarId,
        title: booking.title,
        description: booking.notes ?? '',
        location: booking.studio_id ? 'Studio' : '',
        starts_at: booking.start_time,             // ISO
        ends_at: booking.end_time,                 // ISO
        timezone: booking.timezone || artistTz,
        status: statusNumberToText(booking.status) as any, // 'Unconfirmed' | 'Confirmed' | ...
        customer_email: booking.email_address ?? null,
        customer_name: `${booking.first_name} ${booking.last_name}`.trim(),
      });

      console.log('[GoogleSync] done');
    } catch (e: any) {
      // Do not fail booking on Google issues
      console.warn('[GoogleSync] failed:', e?.response?.data || e?.message || e);
    }

    // 6) Fire & forget: confirmation email (wrap so SMTP credit errors don't break the flow)
    try {
      await sendBookingRequestEmail(data.email_address, data.title, booking);
    } catch (e) {
      console.warn('[createBooking] email failed:', (e as Error).message);
    }

    return { ok: true, data: booking };
  } catch (e: any) {
    logError('[createBooking] unexpected error:', e);
    return toPlainError(e);
  }
}
