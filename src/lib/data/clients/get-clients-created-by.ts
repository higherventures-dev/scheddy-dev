// lib/data/clients/get-clients-created-by.ts
import { SupabaseClient } from '@supabase/supabase-js';

export async function getClientsCreatedBy(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}