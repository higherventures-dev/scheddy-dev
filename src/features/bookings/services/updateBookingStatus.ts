import { createClient } from '@/utils/supabase/client';
import { sendBookingStatusChangeEmail } from '@/features/bookings/services/sendBookingStatusChangeEmail';

export async function updateBookingStatus(
  bookingId: string,
  newStatus: number,
  refreshCalendar: () => void // Parent callback
) {
  const supabase = createClient();

  // ✅ Update booking status
  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)
    .select('id, email_address, status') // ✅ Fetch updated record
    .single();

  if (updateError) {
    console.error('Error updating booking status:', updateError);
    return { success: false, error: updateError };
  }

  if (!updatedBooking) {
    console.error('No updated booking found after update.');
    return { success: false, error: 'No updated booking found.' };
  }

  // ✅ Send email to the updated email address
  try {
    await sendBookingStatusChangeEmail(updatedBooking.email_address, newStatus);
    console.log(`Email sent to ${updatedBooking.email_address}`);
  } catch (emailError) {
    console.error('Error sending status change email:', emailError);
  }

  // ✅ Refresh calendar after update
  if (typeof refreshCalendar === 'function') {
    refreshCalendar();
  }

  return { success: true, data: updatedBooking };
}
