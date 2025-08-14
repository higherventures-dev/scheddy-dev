import { createClient } from '@/utils/supabase/client';
import { sendBookingStatusChangeEmail } from '@/features/bookings/services/sendBookingStatusChangeEmail';

export async function updateBookingStatus(bookingId: string, newStatus: number) {
  const supabase = createClient();

  console.log("Booking Id", bookingId);
  // Update booking
  const { data: updated, error: updateError } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)
    .single(); // returns an object or null

  
  // if (updateError || !updated) {
  //    console.log("UPDATE ERROR", updateError);
  //   console.log("UPD", updated);
  //   console.error('Error updating booking:', updateError);
  //   throw new Error('Booking update failed');
  // }

  // // Get current user (artist)
  // const {
  //   data: { user },
  //   error: userError,
  // } = await supabase.auth.getUser();

  // if (userError || !user) {
  //   console.error('Error fetching current user:', userError);
  //   throw new Error('No authenticated user found');
  // }

  // // Extract emails
  // const artistEmailAddress = user.email ?? '';
  // const bookingEmailAddress = updated.email_address ?? '';

  // // Send emails (don't reuse variable names)
  // await sendBookingStatusChangeEmail(artistEmailAddress, newStatus, updated);
  // await sendBookingStatusChangeEmail(bookingEmailAddress, newStatus, updated);

  return updated;
}
