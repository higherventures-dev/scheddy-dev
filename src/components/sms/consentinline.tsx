'use client';

import { useEffect, useId, useState } from 'react';

type Props = {
  consentCheckboxName?: string;     // default: "sms_opt_in"
  termsHref?: string;               // default: "/terms"
  privacyHref?: string;             // default: "/privacy"
};

export default function SmsConsentInline({
  consentCheckboxName = 'sms_opt_in',
  termsHref = '/terms',
  privacyHref = '/privacy'
}: Props) {
  const consentId = useId();
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);


  return (
    <div className="space-y-2 mt-4">
      <label htmlFor={consentId} className="flex items-start gap-2 text-sm">
        <input
          id={consentId}
          name={consentCheckboxName}
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1"
        />
        <span className="text-xs">
          By checking this box, you agree to receive text messages from <b>Scheddy</b> about appointments and updates.
          Msg&data rates may apply. Reply <b>STOP</b> to opt out, <b>HELP</b> for help.
          <br />
          <a href={termsHref} className="underline">Terms</a> · <a href={privacyHref} className="underline">Privacy</a>
        </span>
      </label>
    
      <input type="hidden" name={`${consentCheckboxName}_boolean`} value={checked ? 'true' : 'false'} />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
