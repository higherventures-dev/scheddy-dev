'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { associateUserWithClient } from '@/features/users/services/associateUserWithClient';
import { encodedRedirect } from '@/utils/utils'; // Make sure this exists
import { supabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
/** ---------------- SIGN IN ---------------- */
// src/app/auth/actions.ts
export async function signInAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const supabase = createServerActionClient({ cookies });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.user) {
    return redirect(`/auth/sign-in?error=${encodeURIComponent(error?.message || 'No user')}`);
  }

  const userId = data.user.id;

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (pErr || !profile?.role) {
    return redirect('/auth/sign-in?error=Missing+user+role');
  }

  switch (String(profile.role).toLowerCase()) {
    case 'client':  return redirect('/lounge');
    case 'artist':  return redirect('/dashboard');
    case 'studio':  return redirect('/studio');
    case 'admin':   return redirect('/admin');
    default:        return redirect('/unauthorized');
  }
}

export async function magicLinkAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    return encodedRedirect('error', '/auth/magic-link', 'Email is required');
  }

  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect('error', '/auth/magic-link', error.message);
  }

  return encodedRedirect(
    'success',
    '/auth/magic-link',
    'Check your email for a sign-in link.'
  );
}

/**
 * Start phone sign-in by sending an SMS code.
 * Expects a <form> with a "phone" field (E.164 recommended, e.g. +14155551234).
 */
export async function signInWithPhoneAction(formData: FormData) {
  const phone = String(formData.get('phone') ?? '').trim();
  if (!phone) {
    return encodedRedirect('error', '/auth/phone', 'Phone number is required');
  }

  const origin =
    (await headers()).get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      // If you’re using a callback route:
      // emailRedirectTo works for email; for phone OTP you typically verify via code form.
      // But keeping a path for post-submit UX is handy:
      shouldCreateUser: true,
      // data: { role: 'client' }, // optional metadata
    },
  });

  if (error) {
    return encodedRedirect('error', '/auth/phone', error.message);
  }

  // Take the user to a page where they can enter the SMS code
  return encodedRedirect('success', `/auth/phone/verify?phone=${encodeURIComponent(phone)}`, 'Code sent via SMS');
}

/**
 * Verify the SMS code the user received.
 * Expects "phone" and "code" fields in the form.
 */
export async function verifyPhoneOtpAction(formData: FormData) {
  const phone = String(formData.get('phone') ?? '').trim();
  const code = String(formData.get('code') ?? '').trim();

  if (!phone || !code) {
    return encodedRedirect('error', '/auth/phone/verify', 'Phone and code are required');
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  });

  if (error || !data?.session) {
    return encodedRedirect('error', '/auth/phone/verify', error?.message ?? 'Invalid code');
  }

  // Optional: look up role and route like your email sign-in flow
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
  // const role = profile?.role?.toLowerCase?.();

  // Redirect wherever successful auth should land:
  return encodedRedirect('success', '/dashboard', 'Signed in with phone');
}


/** ---------------- SIGN UP (DEFAULT) ---------------- */
export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  //const role = formData.get('role') as string;
  const role = "artist"
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return encodedRedirect('error', '/auth/sign-up', 'Email and password are required');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { firstname, lastname, role },
    },
  });

  if (error) {
    return encodedRedirect('error', '/auth/sign-up', error.message);
  }

  return encodedRedirect('success', '/auth/sign-up', 'Thanks for signing up! Please check your email for a verification link.');
};

/** ---------------- SIGN UP (CLIENT SPECIAL) ---------------- */
export const signUpActionClient = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const role = 'client';

  if (!email || !password) {
    return encodedRedirect(
      'error',
      '/auth/sign-up-client',
      'Email and password are required'
    );
  }

  const origin = (await headers()).get('origin');
 const supabase = supabaseAdmin(); // uses SERVICE ROLE key

  // 1️⃣ Create user with admin privileges
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { firstname, lastname, role },
  });

  if (userError || !userData) {
    console.error('Failed to create user:', userError);
    return encodedRedirect('error', '/auth/sign-up-client', userError?.message ?? 'Unknown error');
  }

  const userId = userData.user.id;

  // 2️⃣ Associate user with preexisting client record
  try {
    await associateUserWithClient(userId, email);
  } catch (err: any) {
    console.warn('Failed to associate user with client:', err.message);
    // optional: you can return a warning message instead of failing completely
  }

  // 3️⃣ Redirect success
  return encodedRedirect(
    'success',
    '/auth/sign-up-client',
    'Your account has been created and linked! Please check your email for login details.'
  );
};

/** ---------------- OTHER AUTH ACTIONS ---------------- */
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email) return redirect('/auth/forgot-password');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  return redirect('/auth/forgot-password');
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword || password !== confirmPassword) {
    return redirect('/auth/protected/reset-password');
  }

  const { error } = await supabase.auth.updateUser({ password });
  return redirect('/auth/protected/reset-password');
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/auth/sign-in');
};
