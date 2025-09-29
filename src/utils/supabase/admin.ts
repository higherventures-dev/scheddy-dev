// // utils/supabase/admin.ts
// import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// export function createAdminClient() {
//   return createSupabaseClient(
//     process.env.SUPABASE_URL!,              // Your Supabase URL
//     process.env.SUPABASE_SERVICE_ROLE_KEY!  // Server-side service role key
//   )
// }
import { createClient } from "@supabase/supabase-js";
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
