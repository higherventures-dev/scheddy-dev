export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { syncGoogleForBooking } from '@/lib/google/bookingSync';

function futureISO(mins: number) {
  return new Date(Date.now() + mins * 60_000).toISOString();
}

async function run(req: Request) {
  const supa = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const booking = {
    id: crypto.randomUUID(),
    user_id: user.id,
    title: 'Scheddy Sync Smoke Test',
    description: 'Created by /api/google/debug/sync-sample',
    location: '',
    starts_at: futureISO(10),
    ends_at: futureISO(40),
    timezone: 'America/Los_Angeles',
    status: 'Confirmed' as const,
    customer_email: null,
    customer_name: null,
  };

  try {
    const result = await syncGoogleForBooking(user.id, booking);
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    const body = e?.response?.data ?? e?.message ?? String(e);
    return NextResponse.json({ ok: false, error: body }, { status: 400 });
  }
}

export async function POST(req: Request) { return run(req); }
export async function GET(req: Request)  { return run(req); } // <— added for convenience
