// features/bookings/services/sendBookingConfirmationEmail.ts
import 'server-only'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

type Booking = {
  id: number | string
  first_name?: string | null
  last_name?: string | null
  email_address?: string | null
  title?: string | null
  start_time?: string // ISO
  end_time?: string   // ISO
  timezone?: string | null
  notes?: string | null
}

// --- small utils -------------------------------------------------------------

function escapeHtml(s: string) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Extract a short, human-readable error message without deep property walks */
function normalizeEmailError(err: unknown): string {
  const e: any = err

  // Common SendGrid HTTP error shape: e.response.body.errors is tempting
  // but can be circular / getter-based. Avoid deep chains.
  if (e?.code && e?.message && typeof e.message === 'string') {
    return `SendGrid ${e.code}: ${e.message}`
  }

  // Occasionally SendGrid sets e.response?.statusCode
  if (e?.response?.statusCode) {
    return `SendGrid HTTP ${e.response.statusCode}`
  }

  if (typeof e?.message === 'string') return e.message

  try {
    return JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? String(v) : v))
  } catch {
    return 'Email failed'
  }
}

// --- main API ----------------------------------------------------------------

/**
 * Sends a booking confirmation email via SendGrid.
 * Returns true on success.
 * Throws a small Error(message) on failure (safe to catch in a server action).
 *
 * NOTE: Ensure the caller runs in Node.js runtime (not Edge).
 * In an App Router server action/route file, you can add: `export const runtime = 'nodejs'`.
 */
export async function sendBookingConfirmationEmail(
  toEmail: string,
  subject: string,
  booking: Booking
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY')
  if (!process.env.SENDGRID_FROM) throw new Error('Missing SENDGRID_FROM')

  const tz = booking.timezone || 'America/Los_Angeles'
  const fullName = `${booking.first_name ?? ''} ${booking.last_name ?? ''}`.trim() || 'there'
  const starts = booking.start_time
    ? new Date(booking.start_time).toLocaleString('en-US', { timeZone: tz })
    : '—'
  const ends = booking.end_time
    ? new Date(booking.end_time).toLocaleString('en-US', { timeZone: tz })
    : '—'

  const safeTitle = escapeHtml(booking.title || 'Appointment')
  const safeNotes = booking.notes ? `<p><strong>Notes:</strong> ${escapeHtml(booking.notes)}</p>` : ''

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2>Booking Confirmed</h2>
      <p>Hi ${escapeHtml(fullName)},</p>
      <p>Your booking <strong>${safeTitle}</strong> is confirmed.</p>
      <ul>
        <li><strong>Starts:</strong> ${escapeHtml(starts)}</li>
        <li><strong>Ends:</strong> ${escapeHtml(ends)}</li>
        <li><strong>Timezone:</strong> ${escapeHtml(tz)}</li>
        <li><strong>Reference:</strong> ${escapeHtml(String(booking.id))}</li>
      </ul>
      ${safeNotes}
      <p>We look forward to seeing you!</p>
    </div>
  `.trim()

  const text = [
    'Booking Confirmed',
    ``,
    `Hi ${fullName},`,
    `Your booking "${booking.title || 'Appointment'}" is confirmed.`,
    `Starts: ${starts}`,
    `Ends: ${ends}`,
    `Timezone: ${tz}`,
    `Reference: ${booking.id}`,
    booking.notes ? `` : ``,
    booking.notes ? `Notes: ${booking.notes}` : ``,
  ].filter(Boolean).join('\n')

  const msg = {
    to: toEmail,
    from: process.env.SENDGRID_FROM!,
    replyTo: process.env.SENDGRID_REPLY || process.env.SENDGRID_FROM!,
    subject: subject || 'Your Booking Confirmation',
    html,
    text,
  }

  try {
    await sgMail.send(msg)
    console.log('[Email] sent', { to: toEmail })
    return true
  } catch (err) {
    const msg = normalizeEmailError(err)
    console.error('[Email] send failed:', msg)
    // Throw a *small* error message that won’t recurse or contain circular refs.
    throw new Error(msg || 'Email failed')
  }
}
