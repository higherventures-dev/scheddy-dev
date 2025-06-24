"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const role = formData.get("role") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");


  console.log(`role`);

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/auth/sign-up",
      "Email and password are required",
    );
  }

  console.log("🧪 Supabase project in use:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🧪 Supabase client:", supabase);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { 
        firstname: firstname,
        lastname: lastname,
        role: role,
      },
    },
  });
  
console.log("📡 Supabase project:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("👤 Created user:", data?.user);
console.log("📬 Session:", data?.session);
console.log("⚠️ Error:", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/auth/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/auth/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/auth/sign-in", error.message);
  }

  return redirect("/dashboard");
};


export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/auth/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/auth/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/auth/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/auth/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/auth/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/auth/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/auth/sign-in");
};

export const magicLinkAction = async (formData: FormData) => {
  const supabase = await createClient();
  const email = formData.get("email") as string;
 
  const { error } = await supabase.auth.signInWithOtp({
    email
  });

  // if (error) {
  //   return encodedRedirect("error", "/magic-link", error.message);
  // }
  // return redirect("/protected");
}

export const signInWithPhoneAction = async (formData: FormData) => {
  const supabase = await createClient();
  const phone = formData.get("phone") as string;
 
  const { error } = await supabase.auth.signInWithOtp({
    phone
  });

  if (error) {
    return encodedRedirect("error", "/auth/sign-in-with-phone", error.message);
  }
  // return redirect("/protected");
}