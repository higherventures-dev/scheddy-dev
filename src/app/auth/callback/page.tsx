'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [status, setStatus] = useState<'working'|'done'>('working')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // This parses the URL hash returned by Supabase and sets the session cookie
      const { error } = await supabase.auth.exchangeCodeForSession()

      const dest = searchParams.get('redirect_to') || '/dashboard'

      if (!mounted) return
      setStatus('done')

      if (error) {
        // Common: otp_expired, email link used or timed out
        router.replace(`/auth/sign-in?error=${encodeURIComponent(error.message)}`)
        return
      }

      router.replace(dest)
    })()

    return () => { mounted = false }
  }, [router, searchParams, supabase])

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {status === 'working' ? 'Signing you in…' : 'Redirecting…'}
      </p>
    </div>
  )
}
