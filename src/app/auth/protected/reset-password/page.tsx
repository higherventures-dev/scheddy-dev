// app/protected/reset-password/page.tsx
import { resetPasswordAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = { searchParams?: Record<string, string | string[] | undefined> }

export default function ResetPasswordPage({ searchParams }: Props) {
  const error =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined
  const success =
    typeof searchParams?.success === 'string' ? searchParams.success : undefined

  return (
    <div className="flex w-full justify-center py-16">
      <form
        action={resetPasswordAction}
        noValidate
        className="w-full max-w-md rounded-xl border shadow p-8 space-y-6"
        style={{ backgroundColor: '#1c1c1c' }}
      >
        <header>
          <h1 className="text-2xl font-medium">Set a new password</h1>
          <p className="text-sm text-secondary-foreground mt-1">
            Came here directly? Use&nbsp;
            <Link className="text-primary underline" href="/auth/forgot-password">
              Forgot Password
            </Link>
            &nbsp;to get a reset email first.
          </p>
        </header>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-800">
            Password updated. You can close this tab or continue.
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>

        <SubmitButton>Update Password</SubmitButton>
      </form>
    </div>
  )
}
