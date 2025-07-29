// src/services/getBookingsForUserService.ts
import { createClient } from '@/utils/supabase/server'
import { Booking } from '@/lib/types/booking'

export async function getBookingsForUserService(userId: string): Promise<Booking[]> {
  const supabase = await createClient()

const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    artist:artist_id (
      first_name,
      last_name
    )
  `)
   .eq('user_id', userId)
  .order('created_at', { ascending: false });

  console.log(data)
  if (error) {
    console.error('Error fetching bookings:', error.message)
    return []
  }

  return data as Booking[]
}
