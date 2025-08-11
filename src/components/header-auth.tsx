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
            &nbsp;
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
    <div className="p-2  py-0 px-2 grid grid-cols-3">
      <div className="justify-start">
        
      </div>
      <div className="justify-center items-center text-center">
         <input
    type="search"
    placeholder=""
    className="w-full max-w-xs px-3 py-1 rounded border border-[#3a3a3a] text-[70%] focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
      </div>
      <div className="flex items-right justify-end gap-8">
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
