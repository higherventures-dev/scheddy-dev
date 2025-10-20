// components/Consent.tsx
'use client';
import { useState } from 'react';

export default function Consent({ phoneE164 }: { phoneE164: string }) {
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  async function submit() {
    setSubmitting(true);
    await fetch('/api/sms/consent', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ phoneE164, consent: checked, sourcePath: window.location.pathname })
    });
    setSubmitting(false);
  }
  return (
    <div className="space-y-2">
      <label className="flex items-start gap-2">
        <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} />
        <span>
          By checking this box, you agree to receive text messages from <b>Scheddy</b> about appointments and updates.
          Msg&data rates may apply. Reply STOP to opt out.
          <br/>
          <a href="/terms" className="underline">Terms</a> · <a href="/privacy" className="underline">Privacy</a>
        </span>
      </label>
      <button className="btn" disabled={!checked || submitting} onClick={submit}>
        Save SMS Preferences
      </button>
      <p className="text-sm text-gray-500">Frequency: up to 8 msgs/month depending on activity.</p>
    </div>
  );
}
