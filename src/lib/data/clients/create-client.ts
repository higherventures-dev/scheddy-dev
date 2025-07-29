// =============================
// lib/data/clients/create-client.ts
// =============================

import { SupabaseClient, User } from '@supabase/supabase-js';

export async function createClient(supabase: SupabaseClient, user: User, data: any) {
  const { error, data: result } = await supabase.from('clients').insert([
    {
      ...data,
      created_by: user.id,
      business_id: user.user_metadata?.business_id || null,
    },
  ]).select().single();

  if (error) throw error;
  return result;
}
