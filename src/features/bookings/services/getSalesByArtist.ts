import { createClient } from '@/utils/supabase/server'
import { Booking } from '@/lib/types/booking'

export async function getSalesByArtist(id: string): Promise<any> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*, client:client_id(first_name, last_name)')
    .eq('artist_id', id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error.message)
    return []
  }

  return data as Booking[]
}
