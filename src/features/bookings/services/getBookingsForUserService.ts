// src/services/getBookingsForUserService.ts
import { createClient } from '@/utils/supabase/server'
import { Booking } from '@/lib/types/booking'

export async function getBookingsForUserService(userId: string, email?: string): Promise<Booking[]> {
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      artist:artist_id (
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false })

  if (email) {
    // Use OR filter: user_id = userId OR email_address = email
    query = query.or(`user_id.eq.${userId},email_address.eq.${email}`)
  } else {
    // Just filter by user_id if no email provided
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bookings:', error.message)
    return []
  }

  return data as Booking[]
}
