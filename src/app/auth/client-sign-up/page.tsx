import { signUpActionClient } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 py-36">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <><br></br><br></br>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto border rounded-xl p-10 w-full max-w-md mx-auto shadow">
        <h1 className="text-2xl font-medium text-center">Create Your Scheddy Account</h1>
<br></br>
        
  <div className="flex gap-4">
    <div className="w-1/2">
     <Label htmlFor="firstname">First Name</Label>
          <Input name="firstname" required />
    </div>
    <div className="w-1/2">
          <Label htmlFor="lastname">Last Name</Label>
          <Input name="lastname" required />
    </div>
  </div>
        <div className="flex flex-col gap-4 [&>input]:mb-3 mt-8">

          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />

          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />

          <SubmitButton formAction={signUpActionClient} pendingText="Signing up...">
            Sign up
          </SubmitButton>
    <p className="text-sm text-center text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
          <FormMessage message={searchParams} />
        </div>
      </form>

      <SmtpMessage />
    </>
  );
}