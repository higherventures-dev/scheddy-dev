'use server';

import { sendEmail } from '@/lib/email/sendEmail';

export async function sendBookingNotificationEmail(email_address: string, title: string, bookingDetails: any) {
  const html = `
    <h1>The following booking request has been made.</h1>
    <p>Your booking for <strong>${bookingDetails.title}</strong> is.</p>
    <p>Start: $${bookingDetails.start_time}</p>
    <p>Price: $${bookingDetails.price}</p>
  `;

  await sendEmail({
    to: email_address,
    subject: 'Scheddy Booking Notification | ' + title,
    html,
  });
}
