// src/services/getUserProfile.ts
import { createClient } from '@/utils/supabase/server'

export async function getProfileServices(profileId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*') // extend as needed
    .eq('profile_id', profileId)

  return data
}