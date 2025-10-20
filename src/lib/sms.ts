// lib/sms.ts
import { createClient } from '@supabase/supabase-js';
import Twilio from 'twilio';
import { DateTime } from 'luxon';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const twilio = Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function sendSms({
  to,
  body,
  campaign = 'txn',
  fromOverride
}: { to: string; body: string; campaign?: 'txn'|'care'|'mktg'; fromOverride?: string }) {
  // suppression check
  const { data: sup } = await supabase.from('suppression').select('suppressed').eq('phone_e164', to).maybeSingle();
  if (sup?.suppressed) return { skipped: true, reason: 'suppressed' };

  // quiet hours (optional: use user’s timezone from messaging_consent)
  const { data: consent } = await supabase.from('messaging_consent').select('timezone').eq('phone_e164', to).maybeSingle();
  const zone = consent?.timezone || 'America/Los_Angeles';
  const now = DateTime.now().setZone(zone);
  const start = Number(process.env.QUIET_HOURS_LOCAL_START || 21);
  const end = Number(process.env.QUIET_HOURS_LOCAL_END || 8);
  const hour = now.hour;
  const inQuiet = start > end ? (hour >= start || hour < end) : (hour >= start && hour < end);

  if (inQuiet && campaign !== 'care') {
    // queue instead of sending (implement a queue table or schedule job)
    return { queued: true, reason: 'quiet_hours' };
  }

  const from =
    fromOverride ||
    (campaign === 'txn' ? process.env.TWILIO_NUMBER_TXN! :
     campaign === 'care' ? process.env.TWILIO_NUMBER_CARE! :
     process.env.TWILIO_NUMBER_MKTG!);

  // prepend brand + opt-out (at least first daily send)
  const text = `Scheddy: ${body} Reply STOP to opt out.`;

  const msg = await twilio.messages.create({ to, from, body: text });

  await supabase.from('sms_outbound_log').insert({
    to_e164: to, from_e164: from, campaign, body: text, message_sid: msg.sid, result: msg as any
  });

  return { sid: msg.sid };
}
