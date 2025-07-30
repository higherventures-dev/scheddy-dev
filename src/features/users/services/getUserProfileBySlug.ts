// src/services/getUserProfileBySlug.ts
import { createClient } from '@/utils/supabase/server';

export async function getUserProfileBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single();

  return data
}
