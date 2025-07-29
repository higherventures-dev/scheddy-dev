// lib/data/clients/get-clients.ts
import { SupabaseClient } from '@supabase/supabase-js';

export async function getClients(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}