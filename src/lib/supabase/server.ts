// lib/supabase/server.ts
'use server';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies });
};

// import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'

// export async function createClient() {
//   const cookieStore = await cookies()
//   return createPagesServerClient({ cookies: cookieStore })
// }

// lib/supabase/server.ts
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export function createServerSupabaseClient() {
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies,
//     }
//   );
// }