'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { signInAction } from '@/app/actions'

function MessageBanner() {
  const sp = useSearchParams()
  const serialized = sp?.toString() ?? ''

  const msg = useMemo(() => {
    if (!sp) return null
    const err = sp.get('error')
    const ok = sp.get('success')
    const normalize = (s: string) => {
      const withSpaces = s.replace(/\+/g, ' ')
      try {
        return decodeURIComponent(withSpaces)
      } catch {
        return withSpaces
      }
    }
    if (err) return { kind: 'error' as const, text: normalize(err) }
    if (ok) return { kind: 'success' as const, text: normalize(ok) }
    return null
  }, [serialized, sp])

  if (!msg) return null

  const tone =
    msg.kind === 'error'
      ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-200'
      : 'border-green-300 bg-green-50 text-green-800 dark:border-green-800/60 dark:bg-green-900/30 dark:text-green-200'

  return (
    <div role="status" aria-live="polite" className={`mb-4 rounded-md border p-3 text-sm ${tone}`}>
      {msg.text}
    </div>
  )
}

export default function Login() {
  return (
    <div className="shadow-lg dark:shadow-xl border dark:border-gray-700 justify-center w-full flex py-24">
      <form
        action={signInAction}
        className="flex flex-col min-w-64 max-w-64 mx-auto border rounded-xl p-10 w-full max-w-md shadow"
        style={{ backgroundColor: '#1c1c1c' }}
        noValidate
      >
        <h1 className="text-2xl font-medium text-center">Log in</h1>

        {/* Shows messages from ?error / ?success */}
        <MessageBanner />

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required type="email" />

        <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input name="password" placeholder="Your password" required type="password" />

          <Link className="text-xs text-foreground underline" href="/auth/forgot-password">
            Forgot Password?
          </Link>

          <p className="text-xs text-foreground">
            Don&apos;t have an account?{' '}
            <Link className="text-foreground font-medium underline" href="/auth/sign-up">
              Sign up
            </Link>
            <br />
            <br />
          </p>

          <SubmitButton>Log in</SubmitButton>
        </div>
      </form>
    </div>
  )
}
