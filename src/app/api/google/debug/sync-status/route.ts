export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { syncGoogleForBooking } from '@/lib/google/bookingSync';

type ScheddyStatus = 'Unconfirmed' | 'Confirmed' | 'No-show' | 'Canceled' | 'Completed';

function buildISO(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Invalid date');
  if (!/^\d{2}:\d{2}$/.test(time || '')) throw new Error('Invalid time');
  const dt = new Date(`${date}T${time}:00`);
  if (isNaN(dt.getTime())) throw new Error('Invalid date/time combo');
  return dt.toISOString();
}

export async function POST(req: Request) {
  try {
    const supa = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No session' }, { status: 401 });

    const body = await req.json();
    const {
      bookingId,
      title = 'Scheddy Status Test',
      date,
      time,
      durationMinutes = 60,
      timezone = 'America/Los_Angeles',
      status = 'Confirmed',
      customer_name = null,
      customer_email = null,
    }: {
      bookingId?: string;
      title?: string;
      date: string;
      time: string;     // "HH:mm" 24h
      durationMinutes?: number;
      timezone?: string;
      status?: ScheddyStatus;
      customer_name?: string | null;
      customer_email?: string | null;
    } = body || {};

    if (!date || !time) return NextResponse.json({ ok: false, error: 'Missing date/time' }, { status: 400 });

    const startISO = buildISO(date, time);
    const endISO = new Date(new Date(startISO).getTime() + (durationMinutes || 60) * 60_000).toISOString();
    const id = bookingId || crypto.randomUUID();

    const booking = {
      id,
      user_id: user.id,
      title: `${title} — ${status}`,
      description: `Smoke test (${status})`,
      location: '',
      starts_at: startISO,
      ends_at: endISO,
      timezone,
      status: status as ScheddyStatus,
      customer_email,
      customer_name,
    };

    const result = await syncGoogleForBooking(user.id, booking);
    return NextResponse.json({ ok: true, result, bookingId: id });
  } catch (e: any) {
    const body = e?.response?.data ?? e?.message ?? String(e);
    return NextResponse.json({ ok: false, error: body }, { status: 400 });
  }
}
