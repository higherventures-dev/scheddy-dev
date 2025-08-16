import { createClient } from '@/utils/supabase/server';
import { Booking } from '@/lib/types/booking';

export async function getSalesByArtist(
  id: string,
  currentMonthOnly: boolean = false
): Promise<Booking[]> {
  const supabase = await createClient();

  let query = supabase
    .from('bookings')
    .select('*, client:client_id(first_name, last_name)')
    .eq('artist_id', id)
    .order('created_at', { ascending: false });

  // ✅ Apply current month filter if requested
  if (currentMonthOnly) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    query = query.gte('created_at', startOfMonth).lte('created_at', endOfMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error.message);
    return [];
  }

  return data as Booking[];
}
