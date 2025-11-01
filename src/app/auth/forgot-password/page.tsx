// app/auth/forgot-password/page.tsx  (SERVER COMPONENT)
import { forgotPasswordAction, magicLinkAction } from '@/app/actions'
import { FormMessage } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { SmtpMessage } from '../smtp-message'

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ForgotPassword({ searchParams }: Props) {
  const errorMsg =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined
  const successMsg =
    typeof searchParams?.success === 'string' ? searchParams.success : undefined

  return (
    <>
      <div className="flex w-full justify-center py-16">
        <form
          action={forgotPasswordAction}
          noValidate
          className="w-full max-w-md rounded-xl border shadow p-8 space-y-6"
          style={{ backgroundColor: '#1c1c1c' }}
        >
          <header>
            <h1 className="text-2xl font-medium">Reset or Passwordless Login</h1>
            <p className="text-sm text-secondary-foreground mt-1">
              Already have an account?{' '}
              <Link className="text-primary underline" href="/auth/sign-in">
                Sign in
              </Link>
            </p>
          </header>

          {/* Status message from query (?error / ?success) */}
          <FormMessage message={{ error: errorMsg, success: successMsg }} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            {/* carry next path if you want to route after success */}
            <input type="hidden" name="next" value="/protected/reset-password" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Primary: Reset Password email */}
            <SubmitButton>
              Send Reset Email
            </SubmitButton>

            {/* Secondary: Passwordless login (magic link).
                The button overrides the form's action with its own formAction. */}
            <SubmitButton formAction={magicLinkAction} variant="secondary">
              Login Without Password
            </SubmitButton>
          </div>

          <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1 pt-3">
            <li>Links expire for security. If it’s expired, we’ll offer to resend.</li>
            <li>Check spam/promotions. We disable click-tracking so links aren’t broken by scanners.</li>
          </ul>
        </form>
      </div>

      {/* Shows SMTP provider info / tips if you already use this component */}
      <SmtpMessage />
    </>
  )
}
