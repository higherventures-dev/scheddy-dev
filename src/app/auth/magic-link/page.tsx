'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { magicLinkAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage, Message } from '@/components/form-message';

// Inner form that actually reads the search params
function MagicLinkForm({ message }: { message?: Message }) {
  const qp = useSearchParams();
  const prefilled = qp.get('email') ?? '';

  return (
    <div className="shadow-lg dark:shadow-xl border dark:border-gray-700 p-6 rounded-xl max-w-md">
      <form className="flex-1 flex flex-col min-w-64">
        <h1 className="text-2xl font-medium">Sign in or create your account</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email and we’ll send a magic link. If you’re new, we’ll
          create your account automatically.
        </p>

        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-6">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            defaultValue={prefilled}
            autoFocus
            required
            type="email"
            inputMode="email"
          />
          <SubmitButton pendingText="Sending link…" formAction={magicLinkAction}>
            Send magic link
          </SubmitButton>
          <FormMessage message={message} />
        </div>
      </form>
    </div>
  );
}

// Exported component wraps the form in Suspense
export default function MagicLinkClient({ message }: { message?: Message }) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#808080]">Loading…</div>}>
      <MagicLinkForm message={message} />
    </Suspense>
  );
}
