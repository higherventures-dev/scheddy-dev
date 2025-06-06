' use client '

import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className ="shadow-lg, dark:shadow-x1, border, dark:border-gray-700 justify-center w-full flex py-24 ">
    <form className="flex flex-col min-w-64 max-w-64 mx-auto border rounded-xl p-10 w-full max-w-md mx-auto shadow"   style={{ backgroundColor: "#1c1c1c" }}>
      <h1 className="text-2xl font-medium text-center">Log in</h1>
      
  
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />

         <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
          <p className="text-xs text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
        <br></br><br></br>
      </p>
        <SubmitButton pendingText="Logging In..." formAction={signInAction}>
          Log in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
    </div>
  );
}
