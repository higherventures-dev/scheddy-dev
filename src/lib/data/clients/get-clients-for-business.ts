// =============================
// lib/data/clients/get-clients-for-business.ts
// =============================

import { SupabaseClient } from '@supabase/supabase-js';

export async function getClientsForBusiness(supabase: SupabaseClient, businessId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`created_by.eq.${businessId},business_id.eq.${businessId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
