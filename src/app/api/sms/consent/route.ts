// app/api/sms/consent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Twilio from 'twilio';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const twilio = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: NextRequest) {
  const { phoneE164, consent, sourcePath } = await req.json();

  if (!phoneE164) return NextResponse.json({ error: 'phone required' }, { status: 400 });

  if (!consent) {
    await supabase.from('messaging_consent')
      .upsert({ phone_e164: phoneE164, status: 'none', source: 'web_form', proof: { path: sourcePath }, last_change_at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  }

  // Set pending and send double opt-in
  await supabase.from('messaging_consent')
    .upsert({ phone_e164: phoneE164, status: 'pending', source: 'web_form', proof: { path: sourcePath }, last_change_at: new Date().toISOString() });

  const body = `Scheddy: Reply YES to confirm SMS reminders & updates. Reply HELP for help, STOP to opt out.`;
  await twilio.messages.create({
    to: phoneE164,
    from: process.env.TWILIO_NUMBER_TXN!,
    body
  });

  return NextResponse.json({ ok: true });
}
