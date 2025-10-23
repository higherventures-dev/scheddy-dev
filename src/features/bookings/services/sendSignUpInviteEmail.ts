// features/auth/services/sendSignupInviteEmail.ts
import 'server-only'
import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY')
if (!process.env.SENDGRID_FROM) throw new Error('Missing SENDGRID_FROM')

const APP_BASE_URL = (process.env.APP_BASE_URL || 'https://scheddy.us').replace(/\/+$/, '')
const SIGNUP_URL = process.env.SIGNUP_URL || `${APP_BASE_URL}/signup`

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function escapeHtml(s: string) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeEmailError(err: unknown): string {
  const e: any = err
  if (e?.code && typeof e.message === 'string') return `SendGrid ${e.code}: ${e.message}`
  if (e?.response?.statusCode) return `SendGrid HTTP ${e.response.statusCode}`
  if (typeof e?.message === 'string') return e.message
  try {
    return JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? String(v) : v))
  } catch {
    return 'Email failed'
  }
}

export async function sendSignupInviteEmail(toEmail: string, fullName?: string): Promise<boolean> {
  const launcherUrl = `${SIGNUP_URL}?email=${encodeURIComponent(toEmail)}`
  const name = (fullName && fullName.trim()) || 'there'

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2>Create Your Scheddy Account</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Create your account to view updates and manage your bookings.</p>
      <p><a href="${launcherUrl}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#111;color:#fff;text-decoration:none">Create Account</a></p>
      <p style="font-size:12px;color:#666">If the button doesn’t work, copy and paste this link:<br/>
      <span style="word-break:break-all">${escapeHtml(launcherUrl)}</span></p>
    </div>
  `.trim()

  const text = [
    'Create Your Scheddy Account',
    '',
    `Hi ${name},`,
    'Create your account to view updates and manage your bookings:',
    launcherUrl,
  ].join('\n')

  try {
    await sgMail.send({
      from: process.env.SENDGRID_FROM!,
      replyTo: process.env.SENDGRID_REPLY || process.env.SENDGRID_FROM!,
      to: toEmail,
      subject: 'Finish setting up your account',
      html,
      text,
    })
    console.log('[Email] signup invite sent', { to: toEmail })
    return true
  } catch (err) {
    const m = normalizeEmailError(err)
    console.error('[Email] send failed:', m)
    throw new Error(m || 'Email failed')
  }
}
