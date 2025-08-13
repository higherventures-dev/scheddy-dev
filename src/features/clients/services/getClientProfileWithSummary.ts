import { createClient } from '@/utils/supabase/server';

export async function getClientProfileWithSummary(clientId: string) {
  const supabase = await createClient();

  // Call the RPC function without `.single()` since it returns an array
 const { data: summary, error } = await supabase
  .rpc('booking_summary_for_client', { p_client_id: clientId })
  .single();  // important for JSON object return

  if (error) {
    throw new Error(error.message);
  }

  // summary is an array, grab the first item or fallback to defaults
  const bookingSummary = summary ?? {
    client_id: clientId,
    total_bookings: 0,
    total_revenue: 0,
    total_no_shows: 0,
    total_canceled: 0,
  };

  return bookingSummary;
}
