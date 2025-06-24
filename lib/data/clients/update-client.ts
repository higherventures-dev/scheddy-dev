// =============================
// lib/data/clients/update-client.ts
// =============================

import { SupabaseClient } from '@supabase/supabase-js';

export async function updateClient(supabase: SupabaseClient, clientId: string, data: any) {
  const { error, data: result } = await supabase
    .from('clients')
    .update(data)
    .eq('id', clientId)
    .select()
    .single();

  if (error) throw error;
  return result;
}
