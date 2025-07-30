// import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'

// export function createClient() {
//   return createPagesServerClient({ cookies })
// }

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createPagesServerClient({ cookies: cookieStore })
}