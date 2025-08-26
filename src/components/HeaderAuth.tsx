import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import AuthMenu from '@/components/AuthMenu';

export default async function HeaderAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !hasEnvVars) {
    // Unauthenticated or misconfigured environment
    return (
      <div className="flex items-center">
        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            className="text-xs"
          >
            <Link href="/auth/sign-in">Log in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={"default"}
            className="text-xs"
          >
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, slug, display_name, logo_url")
    .eq("id", user.id)
    .single();

 const displayName = profile?.display_name && profile.display_name.trim() !== ''
    ? profile.display_name
    : "NO NAME";

  const logoSrc = profile?.logo_url && profile.logo_url.trim() !== ''
    ? profile.logo_url
    : '/assets/images/business-avatar.png';
  const firstName = profile?.first_name || user.email;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 
  const bookingUrl = baseUrl +`/book/${profile?.slug}`;

  return (
    <div className="flex-1 p-2 flex py-0 px-8 pb-4">
      <div className="w-[50vw] flex">
          <Image
    src={logoSrc}
    alt={displayName}
    width={28}  // slightly bigger for visibility
    height={28}
    className="rounded"
    unoptimized={true} // remove if using next.config.js domains
  />
  <span className="text-2xl pl-2 font-bold">{displayName}</span>
        {/* <span className="text-xs text-[#808080]"><a href={bookingUrl} target="_blank">{bookingUrl}</a></span>
         */}
      </div>
      <div className="flex justify-end gap-8 w-[50vw]">
        <span className="py-2 text-xs">Logged In: {user.email}!</span>
        <AuthMenu />
      </div>
    </div>
  );
}
