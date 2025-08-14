// /features/bookings/services/associateBookingWithClient.ts
import { createClient } from '@/utils/supabase/server'; // adjust if using your own DB client

/**
 * Associates a client record with a signed-up user account.
 * @param userId - the ID of the authenticated user
 * @param email - the email of the client to claim
 */
export async function associateUserWithClient(userId: string, email: string) {
  const supabase = await createClient();

  // 1. Find all clients with this email that are not yet claimed
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id, created_at, claimed_by')
    .eq('email_address', email)
    .is('claimed_by', null) // Only unclaimed clients
    .order('created_at', { ascending: false }) // Most recent first
    .limit(1);

  if (clientError) {
    throw new Error('Error finding client: ' + clientError.message);
  }

  if (!clients || clients.length === 0) {
    throw new Error('No unclaimed client found for this email.');
  }

  const clientId = clients[0].id;

  // 2. Update the client to link to this user
  const { error: updateError } = await supabase
    .from('clients')
    .update({ claimed_by: userId })
    .eq('id', clientId);

  if (updateError) {
    throw new Error('Failed to associate client: ' + updateError.message);
  }

  return { success: true, clientId };
}
