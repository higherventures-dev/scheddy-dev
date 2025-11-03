// app/auth/sign-in/LoginClient.tsx  (CLIENT COMPONENT)
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { signInAction } from '@/app/actions'
import Image from "next/image";

export default function LoginClient({
  errorMessage,
  successMessage,
  nextPath = '/dashboard',
}: {
  errorMessage?: string
  successMessage?: string
  nextPath?: string
}) {
  const [err] = useState(errorMessage)
  const [ok] = useState(successMessage)

  return (
    <div className="shadow-lg dark:shadow-xl border dark:border-gray-700 justify-center w-full flex py-24">
      <form
        action={signInAction}
        className="flex flex-col min-w-64 max-w-64 mx-auto border rounded-xl p-10 w-full max-w-md shadow"
        style={{ backgroundColor: '#1c1c1c' }}
        noValidate
      >
         {/* Brand row: logo to the left of the word "scheddy" */}
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/assets/images/logo.svg"
                    alt="Scheddy logo"
                    width={28}
                    height={28}
                    priority
                    className="h-7 w-7"
                  />
                  <h1 className="text-xl font-medium text-white">scheddy</h1>
                </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {err}
          </div>
        )}
        {ok && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800">
            {ok}
          </div>
        )}

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required type="email" />

          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input name="password" placeholder="Your password" required type="password" />

          {/* carry next through form posts if you need it */}
          <input type="hidden" name="next" value={nextPath} />

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
