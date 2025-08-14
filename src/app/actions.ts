'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { associateUserWithClient } from '@/features/users/services/associateUserWithClient';
import { encodedRedirect } from '@/utils/utils'; // Make sure this exists
import { createAdminClient } from '@/utils/supabase/admin'

/** ---------------- SIGN IN ---------------- */
export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    return redirect(`/auth/sign-in?error=${encodeURIComponent(error?.message || 'No user')}`);
  }

  const userId = data.user.id;
  if (!userId) throw new Error('Missing user ID after login.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !profile?.role) {
    return redirect('/auth/sign-in?error=Missing+user+role');
  }

  const role = profile.role.toLowerCase();
  switch (role) {
    case 'client':
      return redirect('/lounge');
    case 'artist':
      return redirect('/dashboard');
    case 'studio':
      return redirect('/studio');
    case 'admin':
      return redirect('/admin');
    default:
      return redirect('/unauthorized');
  }
}

/** ---------------- SIGN UP (DEFAULT) ---------------- */
export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const role = formData.get('role') as string;
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
  const supabase = createAdminClient(); // uses SERVICE ROLE key

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
