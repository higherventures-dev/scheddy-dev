// =============================
// lib/data/clients/delete-client.ts
// =============================

import { SupabaseClient } from '@supabase/supabase-js';

export async function deleteClient(supabase: SupabaseClient, clientId: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
  return true;
}
