// /features/bookings/services/associateBookingWithClient.ts
import { createClient } from '@/utils/supabase/server' // adjust if using your own DB client

/**
 * Associates a booking with a client account.
 * @param bookingId - the ID of the booking to associate
 * @param email - the email of the user signing up
 */
export async function associateBookingWithClient(
  bookingId: string,
  email: string
) {
  const supabase = createClient();

  // 1. Find the user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError) {
    throw new Error('User not found or not yet confirmed: ' + userError.message);
  }

  const clientId = user.id;

  // 2. Update the booking to link to this client
  const { error: bookingError } = await supabase
    .from('clients')
    .update({ client_id: clientId })

  return { success: true };
}
