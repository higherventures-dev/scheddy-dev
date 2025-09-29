// src/utils/supabase/server.ts
import { cookies } from 'next/headers';
import {
  createServerComponentClient,
  createServerActionClient,
} from '@supabase/auth-helpers-nextjs';

// Keep the same signature you had; returning a Promise lets existing `await createClient()` continue to work.
export async function createClient() {
  // Cookie-aware client for Server Components / server pages (e.g., /dashboard)
  return createServerComponentClient({ cookies });
}

// Optional helper if you run auth from a Server Action (form action)
export function createActionClient() {
  // Uses the server-action response to set cookies (sb-<ref>-auth-token / refresh-token)
  return createServerActionClient({ cookies });
}

export async function sendMagicLink(email: string) {
  // Use the action client so the response can set cookies if needed in an action context
  const supabase = createServerActionClient({ cookies });
  const { error } = await supabase.auth.signInWithOtp({
    email,
    // (optional but good practice)
    // options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` },
  });
  if (error) throw error;
}

// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export async function createClient() {
//   const cookieStore = await cookies()

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // The `setAll` method was called from a Server Component.
//             // This can be ignored if you have middleware refreshing
//             // user sessions.
//           }
//         },
//       },
//     }
//   )
// }

// export async function sendMagicLink(email: string) {
//   const supabase = await createClient();

//   const { error } = await supabase.auth.signInWithOtp({ email });
//   if (error) throw error;
// }