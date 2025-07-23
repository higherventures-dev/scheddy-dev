import { createClient } from '@/utils/supabase/client';

export async function getServices() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('services')
    .select('*');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data;
}