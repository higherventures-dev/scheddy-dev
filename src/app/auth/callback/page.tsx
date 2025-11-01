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
      const code = searchParams.get('code')
      const dest =
        searchParams.get('next') ||
        searchParams.get('redirect_to') ||
        '/dashboard'

      let error: { message: string } | null = null

      if (code) {
        const res = await supabase.auth.exchangeCodeForSession(code)
        error = res.error
      } else {
        const res = await supabase.auth.exchangeCodeForSession()
        error = res.error
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
