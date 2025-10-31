// src/app/auth/actions.ts
'use server'

import 'server-only'

import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'

import sgMail from '@sendgrid/mail'

import { encodedRedirect } from '@/utils/utils'
import { supabaseAdmin } from '@/utils/supabase/admin'

// ---------- Required server envs ----------
if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL')
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
if (!process.env.SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY')
if (!process.env.SENDGRID_FROM) throw new Error('Missing SENDGRID_FROM')

// Email sender (SendGrid) — disable tracking so auth links aren’t rewritten
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM!,
    subject,
    html,
    trackingSettings: {
      clickTracking: { enable: false, enableText: false },
      openTracking: { enable: false },
      subscriptionTracking: { enable: false },
    },
  })
}

// Admin client for auth.admin.*
const adminAuth = createSupabaseAdmin(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

/** Resend a signup confirmation email via SendGrid using a fresh Supabase link */
async function sendSignupConfirmationEmail(email: string, password: string) {
  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Generate a fresh confirmation link (Supabase does NOT send the email)
  const { data: linkData, error: linkErr } = await adminAuth.auth.admin.generateLink({
    type: 'signup',
    email,
    password, // required for a signup confirmation link
    options: { redirectTo: `${origin}/auth/callback` },
  })
  if (linkErr) throw linkErr

  const actionLink =
    linkData?.properties?.action_link ?? linkData?.properties?.email_otp_link
  if (!actionLink) throw new Error('Could not create a signup confirmation link.')

  await sendEmail({
    to: email,
    subject: 'Confirm your Scheddy account',
    html: `
      <p>Almost there!</p>
      <p>Please confirm your email to finish setting up your account.</p>
      <p><a href="${actionLink}">Confirm account</a></p>
      <p style="margin-top:16px">If the button doesn’t work, copy & paste this URL:<br>${actionLink}</p>
    `,
  })
}

/** ---------------- SIGN IN (password) ---------------- */
export async function signInAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const supabase = createServerActionClient({ cookies })

  // Try to sign in
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  // If Supabase says “email not confirmed,” resend and show a clear error
  if (error) {
    const msg = (error.message || '').toLowerCase()
    const looksUnconfirmed =
      msg.includes('email not confirmed') ||
      msg.includes('confirm your email') ||
      msg.includes('signup verification')

    if (looksUnconfirmed) {
      try {
        await sendSignupConfirmationEmail(email, password)
      } catch {
        // swallow; still show guidance below
      }
      return redirect(
        `/auth/sign-in?error=${encodeURIComponent(
          'Please confirm your email. We just sent you a new confirmation link.'
        )}`
      )
    }

    // Other auth errors
    return redirect(`/auth/sign-in?error=${encodeURIComponent(error.message || 'Sign-in failed')}`)
  }

  // Defensive: if sign-in succeeded but the user is still not confirmed (misconfig)
  const user = data?.user
  const emailConfirmedAt = (user as any)?.email_confirmed_at as string | null | undefined
  if (!emailConfirmedAt) {
    try {
      await sendSignupConfirmationEmail(email, password)
    } catch {}
    try { await supabase.auth.signOut() } catch {}
    return redirect(
      `/auth/sign-in?error=${encodeURIComponent(
        'Please confirm your email. We just sent you a new confirmation link.'
      )}`
    )
  }

  // Fetch role and route
  const userId = user.id
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (pErr || !profile?.role) {
    return redirect('/auth/sign-in?error=Missing+user+role')
  }

  switch (String(profile.role).toLowerCase()) {
    case 'client':  return redirect('/lounge')
    case 'artist':  return redirect('/dashboard')
    case 'studio':  return redirect('/studio')
    case 'admin':   return redirect('/admin')
    default:        return redirect('/unauthorized')
  }
}

/** ---------------- MAGIC LINK (Admin generateLink + SendGrid) ---------------- */
export async function magicLinkAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) {
    return encodedRedirect('error', '/auth/magic-link', 'Email is required')
  }

  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Create magic link (Supabase does NOT send the email)
  const { data: linkData, error } = await adminAuth.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${origin}/auth/callback` },
  })
  if (error) {
    return encodedRedirect('error', '/auth/magic-link', error.message)
  }

  const link = linkData?.properties?.action_link ?? linkData?.properties?.email_otp_link
  if (!link) {
    return encodedRedirect('error', '/auth/magic-link', 'Could not create a magic link.')
  }

  await sendEmail({
    to: email,
    subject: 'Your Scheddy sign-in link',
    html: `
      <p>Tap to sign in:</p>
      <p><a href="${link}">Sign in</a></p>
      <p style="margin-top:16px">If the button doesn’t work, copy & paste this URL:<br>${link}</p>
    `,
  })

  return encodedRedirect('success', '/auth/magic-link', 'Check your email for a sign-in link.')
}

/** ---------------- PHONE: SEND CODE (SMS via Supabase) ---------------- */
export async function signInWithPhoneAction(formData: FormData) {
  const phone = String(formData.get('phone') ?? '').trim()
  if (!phone) {
    return encodedRedirect('error', '/auth/phone', 'Phone number is required')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  })

  if (error) {
    return encodedRedirect('error', '/auth/phone', error.message)
  }
  return encodedRedirect(
    'success',
    `/auth/phone/verify?phone=${encodeURIComponent(phone)}`,
    'Code sent via SMS'
  )
}

/** ---------------- PHONE: VERIFY CODE ---------------- */
export async function verifyPhoneOtpAction(formData: FormData) {
  const phone = String(formData.get('phone') ?? '').trim()
  const code = String(formData.get('code') ?? '').trim()

  if (!phone || !code) {
    return encodedRedirect('error', '/auth/phone/verify', 'Phone and code are required')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  })

  if (error || !data?.session) {
    return encodedRedirect('error', '/auth/phone/verify', error?.message ?? 'Invalid code')
  }
  return encodedRedirect('success', '/dashboard', 'Signed in with phone')
}

/** ---------------- SIGN UP (Admin generateLink + SendGrid) ---------------- */
export async function signUpAction(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()
  const firstname = (formData.get('firstname') as string) || ''
  const lastname  = (formData.get('lastname') as string)  || ''
  const role = 'artist' // default signup role

  if (!email || !password) {
    return encodedRedirect('error', '/auth/sign-up', 'Email and password are required')
  }

  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Create signup confirmation link (Supabase does NOT send the email)
  const { data: linkData, error: linkErr } = await adminAuth.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      redirectTo: `${origin}/auth/callback`,
      data: { firstname, lastname, role }, // raw_user_meta_data
    },
  })
  if (linkErr) {
    return encodedRedirect('error', '/auth/sign-up', linkErr.message)
  }

  const actionLink =
    linkData?.properties?.action_link ?? linkData?.properties?.email_otp_link
  if (!actionLink) {
    return encodedRedirect('error', '/auth/sign-up', 'Could not create a signup link.')
  }

  // Send confirmation email via SendGrid (bypasses Supabase rate limits)
  await sendEmail({
    to: email,
    subject: 'Confirm your Scheddy account',
    html: `
      <p>Welcome${firstname ? `, ${firstname}` : ''}!</p>
      <p>Click below to confirm your account and finish signup.</p>
      <p><a href="${actionLink}">Confirm account</a></p>
      <p style="margin-top:16px">If the button doesn’t work, copy & paste this URL:<br>${actionLink}</p>
    `,
  })

  // Upsert profile proactively (DB trigger removed)
  const uid = linkData.user?.id
  if (uid) {
    const admin = supabaseAdmin()
    await admin.from('profiles').upsert(
      {
        id: uid,
        email_address: email,
        first_name: firstname,
        last_name: lastname,
        role, // Postgres casts to public.user_role
      },
      { onConflict: 'id' }
    )
  }

  return encodedRedirect(
    'success',
    '/auth/sign-up',
    'Thanks for signing up! Check your email to confirm your account.'
  )
}

/** ---------------- FORGOT PASSWORD (Admin generateLink + SendGrid) ---------------- */
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email')?.toString()
  if (!email) return redirect('/auth/forgot-password')

  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  // Create recovery link (Supabase does NOT send the email)
  const { data, error } = await adminAuth.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password` },
  })
  if (error) {
    return redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  const link = data?.properties?.action_link ?? data?.properties?.email_otp_link
  if (!link) {
    return redirect('/auth/forgot-password?error=Could+not+create+reset+link')
  }

  await sendEmail({
    to: email,
    subject: 'Reset your Scheddy password',
    html: `
      <p>Click below to reset your password.</p>
      <p><a href="${link}">Reset password</a></p>
      <p style="margin-top:16px">If the button doesn’t work, copy & paste this URL:<br>${link}</p>
    `,
  })

  return redirect('/auth/forgot-password?success=1')
}

/** ---------------- RESET PASSWORD (after user clicks email) ---------------- */
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword || password !== confirmPassword) {
    return redirect('/auth/protected/reset-password?error=Password+mismatch')
  }

  await supabase.auth.updateUser({ password })
  return redirect('/auth/protected/reset-password?success=1')
}

/** ---------------- SIGN OUT ---------------- */
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/auth/sign-in')
}
