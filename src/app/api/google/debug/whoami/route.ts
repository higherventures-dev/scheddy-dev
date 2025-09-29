// src/app/api/google/debug/whoami/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { google } from 'googleapis';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET() {
  const supa = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const { data: row } = await supabaseAdmin
    .from('google_oauth_tokens')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!row) return NextResponse.json({ connected: false, reason: 'No tokens row' });

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );
  oauth2.setCredentials({ refresh_token: row.refresh_token });

  try {
    const me = await google.oauth2({ version: 'v2', auth: oauth2 }).userinfo.get();
    return NextResponse.json({ connected: true, email: me.data.email, calendarId: row.calendar_id || 'primary' });
  } catch (e: any) {
    return NextResponse.json({ connected: false, reason: e?.message || String(e) }, { status: 400 });
  }
}
