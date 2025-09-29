import { createClient } from '@/utils/supabase/client';

export async function cancelBooking(bookingId: string) {

  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status: 3 }) // assuming 0 = cancelled
      .eq("id", bookingId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return { success: false, error: err };
  }
}
