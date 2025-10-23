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
    return (
      <div className="flex items-center">
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href="/auth/sign-in">Log in</Link>
          </Button>
          <Button asChild size="sm" variant="default" className="text-xs">
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, slug, display_name, logo_url")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name?.trim() ? profile.display_name.trim() : "NO NAME";

  const logoSrc =
    profile?.logo_url?.trim() ? profile.logo_url.trim() : "/assets/images/business-avatar.png";

  // Friendly name logic: profile.first_name -> user_metadata.full_name/name -> email
  const firstFromProfile = profile?.first_name?.trim();
  const fullNameFromMeta =
    (user.user_metadata?.full_name || user.user_metadata?.name || "").trim();
  const firstFromMeta = fullNameFromMeta ? fullNameFromMeta.split(/\s+/)[0] : "";
  const friendlyName = firstFromProfile || firstFromMeta || user.email;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const bookingUrl =
    baseUrl && profile?.slug ? `${baseUrl}/book/${profile.slug}` : undefined;

  return (
    <div className="flex-1 p-2 flex py-0 px-8 pb-4">
      <div className="w-[50vw] flex items-center">
        <Image
          src={logoSrc}
          alt={displayName}
          width={21}
          height={21}
          className="rounded"
          unoptimized={true}
        />
        <span className="text-xl pl-2 font-bold">{displayName}</span>
        {/* {bookingUrl && (
          <span className="text-xs text-[#808080]">
            <a href={bookingUrl} target="_blank" rel="noreferrer">{bookingUrl}</a>
          </span>
        )} */}
      </div>

      <div className="flex justify-end gap-8 w-[50vw] items-center">
        <span className="py-2 text-xs">Welcome back {friendlyName}!</span>
        <AuthMenu />
      </div>
    </div>
  );
}
