// src/services/getUserProfile.ts
import { createClient } from '@/utils/supabase/server'

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, firstName, lastName, role') // extend as needed
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error.message)
    return []
  }

  return data
}