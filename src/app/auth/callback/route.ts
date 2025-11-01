// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const url = new URL(request.url)
  const next = url.searchParams.get('next') || url.searchParams.get('redirect_to') || '/dashboard'
  const email = url.searchParams.get('email') ?? undefined

  const supabase = await createClient()

  // 1) OAuth/PKCE
  const code = url.searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, url)
      )
    }
    return NextResponse.redirect(new URL(next, url))
  }

  // 2) Magic link / recovery
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as 'magiclink' | 'recovery' | 'email_change' | 'signup' | null
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, url)
      )
    }
    return NextResponse.redirect(new URL(next, url))
  }

  // 3) Email hash flows must be handled on the client
  const redirect = new URL('/auth/hash-callback', url)
  if (email) redirect.searchParams.set('email', email)
  redirect.searchParams.set('next', next)
  return NextResponse.redirect(redirect)
}
