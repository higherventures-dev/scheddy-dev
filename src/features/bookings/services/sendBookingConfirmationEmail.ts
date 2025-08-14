'use server';

import { sendEmail } from '@/lib/email/sendEmail';
import { format } from 'date-fns'; // using date-fns for formatting

export async function sendBookingConfirmationEmail(
  email_address: string,
  title: string,
  bookingDetails: any
) {
  // Convert timestamp to Date object
  const startDate = new Date(bookingDetails.start_time);

  // Format as long date and time, e.g., "Tuesday, August 13, 2025 at 5:30 PM"
  const formattedDate = format(startDate, "EEEE, MMMM d, yyyy 'at' h:mm a");

  // Construct the client signup URL with bookingId as query param
  const clientSignupUrl = `/auth/client-sign-up?bookingId=${bookingDetails.id}&email=${encodeURIComponent(email_address)}`;

  const html = `
    <p>Your booking request for a <strong>${bookingDetails.title}</strong> on <strong>${formattedDate}</strong> has been received.</p>

    <p>To manage your booking and future appointments, create your client account using the link below:</p>
    <p><a href="${clientSignupUrl}">Create My Account</a></p>

    <p>Thank you for using Scheddy!</p>
  `;

  await sendEmail({
    to: email_address,
    subject: 'Scheddy Booking Confirmation | ' + title,
    html,
  });
}
