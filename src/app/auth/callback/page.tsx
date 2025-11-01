// app/auth/callback/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

// Prevent static prerendering (critical for auth callbacks)
export const dynamic = 'force-dynamic'
export const revalidate = 0

function CallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [status, setStatus] = useState<'working' | 'done'>('working')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const code = searchParams.get('code') ?? undefined
      const token_hash = searchParams.get('token_hash') ?? undefined
      // magic link / recovery / email_change / signup typically set ?type=...
      const type = (searchParams.get('type') ?? undefined) as
        | 'magiclink'
        | 'recovery'
        | 'email_change'
        | 'signup'
        | undefined

      const dest =
        searchParams.get('next') ||
        searchParams.get('redirect_to') ||
        '/dashboard'

      let error: { message: string } | null = null

      if (code) {
        // OAuth / PKCE callback
        const { error: e } = await supabase.auth.exchangeCodeForSession(code)
        error = e
      } else if (token_hash && type) {
        // Magic link / recovery / email-change callback
        const { error: e } = await supabase.auth.verifyOtp({ token_hash, type })
        error = e
      } else {
        error = { message: 'Missing auth parameters in callback URL' }
      }

      if (!mounted) return
      setStatus('done')

      if (error) {
        router.replace(
          `/auth/sign-in?error=${encodeURIComponent(error.message)}`
        )
        return
      }

      router.replace(dest)
    })()

    return () => {
      mounted = false
    }
  }, [router, searchParams, supabase])

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {status === 'working' ? 'Signing you in…' : 'Redirecting…'}
      </p>
    </div>
  )
}

export default function Page() {
  // ✅ Required Suspense wrapper for useSearchParams()
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md p-6 text-center">
          <p className="text-sm text-muted-foreground">Processing sign-in…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  )
}
