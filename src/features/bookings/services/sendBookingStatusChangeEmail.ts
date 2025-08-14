'use server';

import { sendEmail } from '@/lib/email/sendEmail';

export async function sendBookingStatusChangeEmail(email_address: string, bookingDetails: any) {
  let subject = "";
  let html = `
    <p>Your booking with <strong>${bookingDetails.artist_id}</strong> on <strong>${new Date(bookingDetails.start_time).toLocaleString()}</strong> has been updated to:</p>
  `;

  switch (bookingDetails.status) {
    case 1: // unconfirmed
      subject = "UNCONFIRMED : Scheddy Booking Status";
      html += `<p><strong>UNCONFIRMED</strong></p>`;
      break;
    case 2: // confirmed
      subject = "CONFIRMED : Scheddy Booking Status";
      html += `<p><strong>CONFIRMED</strong></p>`;
      break;
    case 3: // no-show
      subject = "NO-SHOW : Scheddy Booking Status";
      html += `<p><strong>NO-SHOW</strong></p>`;
      break;
    case 4: // canceled
      subject = "CANCELED : Scheddy Booking Status";
      html += `<p><strong>CANCELED</strong></p>`;
      break;
    case 5: // completed
      subject = "COMPLETED : Scheddy Booking Status";
      html += `<p><strong>COMPLETED</strong></p>`;
      break;
    default:
      subject = "BOOKING STATUS UPDATED : Scheddy";
      html += `<p><strong>UPDATED</strong></p>`;
  }

  await sendEmail({
    to: email_address,
    subject,
    html,
  });
}
