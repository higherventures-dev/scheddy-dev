import { createClient } from '@/utils/supabase/client';

export async function updateBookingStatus(bookingId: string, newStatus: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)
    .single();

  return { data, error };
}   