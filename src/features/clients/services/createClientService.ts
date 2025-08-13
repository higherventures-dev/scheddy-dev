'use server';

import { createClient } from '@/utils/supabase/client';

export async function createClientService(data: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  artist_id?: string;
  studio_id?: string;
}): Promise<string> {
  const supabase = await createClient();

  const { data: inserted, error: insertError } = await supabase
    .from('clients')
    .insert([
      {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email_address: data.email_address,
        studio_id: data.studio_id,
        artist_id: data.artist_id,
      },
    ])
    .select('id')
    .single<{ id: string }>();

  if (insertError) {
    console.error('Scheddy Client Insert Error:', insertError.message, insertError.details);
    throw insertError;
  }

  return inserted.id;
}