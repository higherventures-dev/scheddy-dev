import { createClient } from '@/utils/supabase/server'

export async function getUserIdFromSession() {
 const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return user.id
}