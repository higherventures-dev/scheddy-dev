import { createClient } from '@/utils/supabase/client';

export async function getBookingById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}