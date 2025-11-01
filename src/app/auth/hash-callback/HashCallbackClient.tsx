'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function HashCallbackClient({
  email,
  next = '/dashboard',
}: {
  email?: string
  next?: string
}) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    (async () => {
      // Read from window — no Next hooks
      const search = typeof window !== 'undefined' ? window.location.search : ''
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      const hp = parseHash(hash)

      const error = hp['error']
      const error_code = hp['error_code']
      const access_token = hp['access_token']
      const refresh_token = hp['refresh_token']

      // If tokens in hash, set session
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        // clean the hash
        if (typeof window !== 'undefined') {
          history.replaceState(null, '', window.location.pathname + search)
        }
        if (error) {
          return router.replace(
            `/auth/sign-in?error=${encodeURIComponent(error.message)}`
          )
        }
        return router.replace(next)
      }

      // Expired/invalid hash — optionally auto-resend if we have email
      if (
        (error === 'access_denied' && error_code === 'otp_expired') ||
        error_code === 'otp_disabled'
      ) {
        if (typeof window !== 'undefined') {
          history.replaceState(null, '', window.location.pathname + search)
        }
        if (email) {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
          })
          if (error) {
            return router.replace(
              `/auth/sign-in?error=${encodeURIComponent(error.message)}`
            )
          }
          return router.replace(
            `/auth/sign-in?success=${encodeURIComponent(
              'We sent you a new verification link. Check your email.'
            )}`
          )
        }
        return router.replace(
          `/auth/sign-in?error=${encodeURIComponent(
            'Your verification link expired. Please sign in to resend.'
          )}`
        )
      }

      // Fallback
      return router.replace(
        `/auth/sign-in?error=${encodeURIComponent('Missing auth parameters')}`
      )
    })()
  }, [email, next, router, supabase])

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-sm opacity-80">Finalizing sign-in…</p>
    </div>
  )
}
