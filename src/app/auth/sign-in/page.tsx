'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/submit-button';
import Link from 'next/link';
import { signInAction } from '@/app/actions';

export default function Login() {
  return (
    <div className="shadow-lg dark:shadow-x1 border dark:border-gray-700 justify-center w-full flex py-24">
      {/* Notice action prop here calls server action automatically */}
      <form
        action={signInAction}
        className="flex flex-col min-w-64 max-w-64 mx-auto border rounded-xl p-10 w-full max-w-md mx-auto shadow"
        style={{ backgroundColor: '#1c1c1c' }}
        noValidate
      >
        <h1 className="text-2xl font-medium text-center">Log in</h1>

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
            Don't have an account?{' '}
            <Link className="text-foreground font-medium underline" href="/auth/sign-up">
              Sign up
            </Link>
            <br />
            <br />
          </p>

          {/* You can't show client-side errors here easily with server action without error boundaries */}

          <SubmitButton>
            Log in
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}