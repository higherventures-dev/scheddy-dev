import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import ClientAuthMenu from '@/components/ClientAuthMenu';

export default async function HeaderAuthClient() {
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
    .select("first_name") // Add last_name or role if needed
    .eq("id", user.id)
    .single();

  const firstName = profile?.first_name || user.email;

  return (
    <div className="flex-1 p-2 flex py-0 px-2">
      <div className="w-[50vw] px-3 flex">
        <Image src="/assets/images/logo.svg" alt="Scheddy" width={15} height={5} />
        <span className="pt-1 pl-2 text-lg">scheddy</span>
      </div>
      <div className="flex justify-end gap-8 w-[50vw]">
        <span className="py-2 text-xs">Welcome, {firstName}!</span>
        <ClientAuthMenu />
      </div>
    </div>
  );
}
