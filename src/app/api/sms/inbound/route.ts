// app/api/sms/inbound/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { twiml as Twiml } from 'twilio';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function xml(msg: string) {
  const r = new Twiml.MessagingResponse();
  r.message(msg);
  return new Response(r.toString(), { headers: { 'Content-Type': 'text/xml' } });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const from = String(form.get('From') || '');
  const to = String(form.get('To') || '');
  const body = String(form.get('Body') || '');
  const normalized = body.trim().toUpperCase();

  // log inbound
  await supabase.from('sms_inbound_log').insert({
    from_e164: from, to_e164: to, body, normalized, meta: Object.fromEntries(form as any)
  });

  if (['STOP','UNSUBSCRIBE','CANCEL','END','QUIT'].includes(normalized)) {
    await supabase.from('messaging_consent').upsert({ phone_e164: from, status: 'opted_out', last_change_at: new Date().toISOString() });
    await supabase.from('suppression').upsert({ phone_e164: from, suppressed: true, reason: 'STOP', updated_at: new Date().toISOString() });
    return xml(`You've opted out of Scheddy texts. Reply START to re-subscribe.`);
  }

  if (['START','UNSTOP','YES'].includes(normalized)) {
    // If they were 'pending' or 'opted_out', move to opted_in
    await supabase.from('messaging_consent').upsert({ phone_e164: from, status: 'opted_in', last_change_at: new Date().toISOString() });
    await supabase.from('suppression').upsert({ phone_e164: from, suppressed: false, reason: 'START', updated_at: new Date().toISOString() });
    return xml(`You're subscribed to Scheddy reminders & updates. Reply HELP for help, STOP to opt out.`);
  }

  if (['HELP','INFO'].includes(normalized)) {
    await supabase.from('messaging_consent').update({ last_help_at: new Date().toISOString() }).eq('phone_e164', from);
    return xml(`Scheddy support: We send appointment reminders & updates. Msg&data rates may apply. STOP to opt out. Help: ${process.env.PUBLIC_SITE_ORIGIN}/help`);
  }

  // Route to support workflow or ignore
  return xml(''); // 200 OK, empty response
}
