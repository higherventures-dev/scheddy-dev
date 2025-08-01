import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(toEmail: string, bookingDetails: any) {
  try {
    await resend.emails.send({
      from: 'Scheddy <no-reply@scheddy.us>',
      to: toEmail,
      subject: 'Scheddy Booking Confirmation',
      html: `
        <h1>Thank you for your booking!</h1>
        <p>Your booking for <strong>${bookingDetails.title}</strong> is confirmed.</p>
        <p>Price: $${bookingDetails.price}</p>
        <p>We look forward to seeing you!</p>
      `,
    })
    console.log('Booking confirmation email sent successfully!')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}