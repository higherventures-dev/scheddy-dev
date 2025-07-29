// src/services/getUserProfileBySlug.ts
import { createClient } from '@/utils/supabase/server'

export async function getUserProfileBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      services (*)
    `)
    .eq('slug', slug)
    .single()

  console.log(data)
  if (error) {
    console.error('Error fetching user profile:', error.message)
    return []
  }

  return data
}