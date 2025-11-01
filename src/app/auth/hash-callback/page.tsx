// app/auth/hash-callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function parseHash(hash: string) {
  const out: Record<string, string> = {}
  const h = hash.startsWith('#') ? hash.slice(1) : hash
  for (const pair of h.split('&')) {
    if (!pair) continue
    const [k, v] = pair.split('=')
    out[decodeURIComponent(k)] = decodeURIComponent(v || '')
  }
  return out
}

export default function HashCallbackPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    (async () => {
      const next = sp.get('next') || '/dashboard'
      const email = sp.get('email') ?? undefined

      const hp = typeof window !== 'undefined' ? parseHash(window.location.hash) : {}
      const error = hp['error']
      const error_code = hp['error_code']
      const access_token = hp['access_token']
      const refresh_token = hp['refresh_token']

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        history.replaceState(null, '', window.location.pathname + window.location.search)
        if (error) return router.replace(`/auth/sign-in?error=${encodeURIComponent(error.message)}`)
        return router.replace(next)
      }

      if ((error === 'access_denied' && error_code === 'otp_expired') || error_code === 'otp_disabled') {
        history.replaceState(null, '', window.location.pathname + window.location.search)
        if (email) {
          const { error } = await supabase.auth.resend({ type: 'signup', email })
          if (error) return router.replace(`/auth/sign-in?error=${encodeURIComponent(error.message)}`)
          return router.replace(`/auth/sign-in?success=${encodeURIComponent('We sent you a new verification link. Check your email.')}`)
        }
        return router.replace(`/auth/sign-in?error=${encodeURIComponent('Your verification link expired. Please sign in to resend.')}`)
      }

      router.replace(`/auth/sign-in?error=${encodeURIComponent('Missing auth parameters')}`)
    })()
  }, [router, sp, supabase])

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-sm opacity-80">Finalizing sign-in…</p>
    </div>
  )
}
