// features/google/syncBooking.ts
export type ScheddyStatus = 'Unconfirmed' | 'Confirmed' | 'No-show' | 'Canceled' | 'Completed';

export async function syncBookingToGoogle(params: {
  bookingId: string;
  userId: string;
  calendarId?: string;
  title: string;
  startIso: string;
  endIso: string;
  timezone: string;
  status: ScheddyStatus;
  description?: string;
}) {
  const res = await fetch('/api/google/sync', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok && json?.code === 'GOOGLE_REAUTH_REQUIRED') {
    // surface to callers so they can show a reconnect banner/dialog
    return { ok: false, code: 'GOOGLE_REAUTH_REQUIRED', error: json?.error || 'Reconnect Google' };
  }
  return json;
}
