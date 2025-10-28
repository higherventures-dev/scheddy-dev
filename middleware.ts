// /middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// ✅ Only run on protected paths (so it never touches your auth forms/Server Actions)
export const config = {
  matcher: ['/dashboard/:path*', '/studio/:path*', '/admin/:path*'],
}

export async function middleware(req: NextRequest) {
  // Extra safety: if a Server Action sneaks in here, let it pass
  if (req.headers.has('next-action') || req.headers.has('Next-Action')) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  // Keep Supabase cookies fresh (does not read the body)
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there’s no session, bounce to sign-in with return url
  if (!session) {
    const signin = new URL(
      `/auth/sign-in?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`,
      req.url
    )
    return NextResponse.redirect(signin)
  }

  return res
}
