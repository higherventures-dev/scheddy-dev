import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";


export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  

  if (!hasEnvVars) {
    
  // Query the `profiles` table for the custom role
  const { data: profile, error: profileError } = await supabase
    .from("profiles") // change this if your table has a different name
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role ?? "User"; // fallback if role is missing
    return (
      <>
        <div className="flex items-center">
          <div>
            TEST
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/auth/sign-in" className="text-sm">Log in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/auth/sign-up" className="text-sm">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }


  return user ? (
    <div className="flex-1 p-2 flex py-0 px-2">
    <div className="w-[50vw]">
        <div className="text-3xl font-bold tracking-wide uppercase text-[#E5C26A]">
            Wayward Tattoo
        </div>
        <div className="text-[0.625rem] px-1">
            6678 Antigua Blvd, San Diego, CA 92126 &nbsp;&nbsp;:&nbsp;&nbsp;(999) 999-9999
        </div>
    </div>
    <div className="flex justify-end gap-8 w-[50vw]">
      <span className="py-2 text-xs">Logged In: {user.email}</span>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} size="sm" className="text-xs">
          Sign out
        </Button>
      </form>
    </div>
    </div>
  ) : (
    <div className="flex-1 p-4 flex justify-end">
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"} className="text-xs">
        <Link href="/auth/sign-in" className="text-xs">Log in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"} className="text-xs">
        <Link href="/auth/sign-up" className="text-xs">Sign up</Link>
      </Button>
    </div>
    </div>
  );
}
