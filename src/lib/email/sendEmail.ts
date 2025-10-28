// lib/email/sendEmail.ts
'use server';

import sgMail from '@sendgrid/mail';

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;     // optional override
  replyTo?: string;  // optional override
};

function normalizeEmailError(err: unknown): string {
  const e: any = err;
  if (e?.code && typeof e?.message === 'string') return `SendGrid ${e.code}: ${e.message}`;
  if (e?.response?.statusCode) return `SendGrid HTTP ${e.response.statusCode}`;
  if (typeof e?.message === 'string') return e.message;
  try {
    return JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? String(v) : v));
  } catch {
    return 'Email failed';
  }
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
}: SendEmailArgs) => {
  if (!process.env.SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY');
  const defaultFrom =
    from ||
    process.env.EMAIL_FROM ||    // prefer a generic EMAIL_FROM if you use one
    process.env.SENDGRID_FROM;   // or the SendGrid-specific var

  if (!defaultFrom) throw new Error('Missing EMAIL_FROM or SENDGRID_FROM');

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const [res] = await sgMail.send({
      to,
      from: defaultFrom,
      subject,
      html,
      text, // optional plaintext
      replyTo: replyTo || process.env.SENDGRID_REPLY || defaultFrom,
    });
    return res; // contains statusCode, headers, etc.
  } catch (err) {
    const msg = normalizeEmailError(err);
    console.error('[sendEmail] failed:', msg);
    throw new Error(msg || 'Email failed');
  }
};
