'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MagicLinkClient() {
  const params = useSearchParams();
  const router = useRouter();

  // Example: read token and proceed
  useEffect(() => {
    const token = params.get('token') || params.get('code');
    if (!token) return;
    // TODO: handle token (verify, sign in, redirect, etc.)
    // router.push('/dashboard'); // for example
  }, [params, router]);

  return <div className="p-6">Checking your magic link…</div>;
}
