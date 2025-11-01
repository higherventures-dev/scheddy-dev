// app/protected/page.tsx
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

export default function ProtectedHashCatcher() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    (async () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      const params = parseHash(hash)
      const access_token = params['access_token']
      const refresh_token = params['refresh_token']
      const next = params['redirect_to'] || '/dashboard'

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        // clear the hash
        history.replaceState(null, '', window.location.pathname)
        return router.replace(error
          ? `/auth/sign-in?error=${encodeURIComponent(error.message)}`
          : next)
      }

      router.replace(`/auth/sign-in?error=${encodeURIComponent('Missing tokens')}`)
    })()
  }, [router, supabase])

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-sm text-muted-foreground">Finalizing sign-in…</p>
    </div>
  )
}
