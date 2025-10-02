// src/services/getBookingsForUserService.ts
import { createClient } from '@/utils/supabase/server'
import { Booking } from '@/lib/types/booking'

export async function getBookingsForArtistService(userId: string, email?: string): Promise<Booking[]> {
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      client:client_id (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false })


    // Just filter by user_id if no email provided
    query = query.eq('artist_id', userId)


  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings:', error.message)
    return []
  }

  return data as Booking[]
}
