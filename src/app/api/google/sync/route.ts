// app/api/google/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

// ... your existing env + sb client + types + mapStatusToGoogle ...

async function invalidateGoogleTokens(userId: string) {
  // Prefer delete: user must re-consent anyway
  const { error } = await sb
    .from('google_oauth_tokens')
    .delete()
    .eq('user_id', userId);
  if (error) console.error('[google/sync] Failed to invalidate tokens:', error);
}

// ---------- DB + AUTH IMPLEMENTATIONS (Supabase) ----------
async function getOAuthClientForUser(userId: string) {
  if (!userId) throw new Error('Missing userId');
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Missing Google OAuth env vars');
  }

  const { data: tokenRow, error: tokenErr } = await sb
    .from('google_oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tokenErr || !tokenRow) {
    const err = new Error('GOOGLE_REAUTH_REQUIRED');
    (err as any).code = 'GOOGLE_REAUTH_REQUIRED';
    throw err;
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  const creds: any = {};
  if (tokenRow.access_token)  creds.access_token  = tokenRow.access_token;
  if (tokenRow.refresh_token) creds.refresh_token = tokenRow.refresh_token;
  if (tokenRow.scope)         creds.scope         = tokenRow.scope;
  if (tokenRow.token_type)    creds.token_type    = tokenRow.token_type;
  if (tokenRow.id_token)      creds.id_token      = tokenRow.id_token;
  if (tokenRow.expiry_date)   creds.expiry_date   = tokenRow.expiry_date;

  oAuth2Client.setCredentials(creds);

  // Persist refreshed tokens
  oAuth2Client.on('tokens', async (tokens) => {
    try {
      await sb.from('google_oauth_tokens').upsert(
        {
          user_id: userId,
          access_token:  tokens.access_token  ?? tokenRow.access_token,
          refresh_token: tokens.refresh_token ?? tokenRow.refresh_token,
          scope:         tokens.scope         ?? tokenRow.scope,
          token_type:    tokens.token_type    ?? tokenRow.token_type,
          id_token:      tokens.id_token      ?? tokenRow.id_token,
          expiry_date:   typeof tokens.expiry_date === 'number' ? tokens.expiry_date : tokenRow.expiry_date,
        },
        { onConflict: 'user_id' }
      );
    } catch (e) {
      console.error('[google/sync] token upsert failed:', e);
    }
  });

  // Proactive refresh; catch invalid_grant early
  try {
    await oAuth2Client.getAccessToken();
  } catch (e: any) {
    const msg = e?.message || '';
    const gerr = e?.response?.data?.error || '';
    if (/invalid_grant/i.test(msg) || /invalid_grant/i.test(gerr)) {
      await invalidateGoogleTokens(userId);
      const err = new Error('GOOGLE_REAUTH_REQUIRED');
      (err as any).code = 'GOOGLE_REAUTH_REQUIRED';
      throw err;
    }
    throw e;
  }

  return oAuth2Client;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // ... your existing body validation, mapStatusToGoogle, calendar client, etc ...

    // (rest of handler unchanged)
  } catch (err: any) {
    const code = err?.code || err?.response?.data?.error;
    if (code === 'GOOGLE_REAUTH_REQUIRED') {
      return NextResponse.json(
        { ok: false, code: 'GOOGLE_REAUTH_REQUIRED', error: 'Google account needs to be reconnected.' },
        { status: 401 }
      );
    }
    // Also normalize raw Google invalid_grant here if thrown outside getOAuthClientForUser
    const msg = err?.message || '';
    const gerr = err?.response?.data?.error || '';
    if (/invalid_grant/i.test(msg) || /invalid_grant/i.test(gerr)) {
      return NextResponse.json(
        { ok: false, code: 'GOOGLE_REAUTH_REQUIRED', error: 'Google account needs to be reconnected.' },
        { status: 401 }
      );
    }

    console.error('[google/sync] Error:', err);
    return NextResponse.json({ ok: false, error: msg || String(err) }, { status: 500 });
  }
}
