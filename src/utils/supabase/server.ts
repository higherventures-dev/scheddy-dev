// src/utils/supabase/server.ts
import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createClient() {
  const cookieStore = cookies()
  const headerList = headers()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // called by Supabase to read the current cookies
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // called by Supabase to set auth cookies on the response
        set(name: string, value: string, options: Parameters<typeof cookieStore.set>[0] & any = {}) {
          cookieStore.set({ name, value, ...options })
        },
        // convenience: allow removals
        remove(name: string, options: any = {}) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
      headers: {
        // keeps GoTrue happy behind proxies (Vercel, etc.)
        'x-forwarded-host': headerList.get('x-forwarded-host') ?? headerList.get('host') ?? '',
        'x-forwarded-proto': headerList.get('x-forwarded-proto') ?? 'https',
        'x-forwarded-for': headerList.get('x-forwarded-for') ?? '',
      },
    }
  )
}
