// utils/supabase/admin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRole) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

  _admin = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'admin-server' } },
  });
  return _admin;
}
