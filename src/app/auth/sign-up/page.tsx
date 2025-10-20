import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import SmsConsentInline from "@/components/sms/consentinline";

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
    <>
      <br />
      <br />
      <form
        className="
          flex flex-col min-w-64 border border-bg-[#1c1c1c] rounded-xl p-8 w-full max-w-md mx-auto shadow text-xs
          bg-black
          [&_label]:text-xs
          [&_input]:bg-[#1C1C1C]
          [&_input]:text-sm
          [&_input::placeholder]:text-xs
          [&_input]:text-white
          [&_input::placeholder]:text-white/60
          [&_input]:border-0
          [&_input]:ring-0
          [&_input]:focus-visible:ring-2
          [&_input]:focus-visible:ring-primary/40
          [&_input]:rounded-lg
          [&_input]:px-2.5
          [&_input]:py-1
        "
      >
        <h1 className="text-xl font-medium text-center text-white">scheddy</h1>
        <h4 className="text-[11px] text-center text-white/80">
          Create your account below.
        </h4>

        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="firstname" className="text-white/90">
                First Name
              </Label>
              <Input id="firstname" name="firstname" autoComplete="given-name" required />
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="lastname" className="text-white/90">
                Last Name
              </Label>
              <Input id="lastname" name="lastname" autoComplete="family-name" required />
            </div>
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="phone" className="text-white/90">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="(555) 555-5555"
              autoComplete="tel"
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="email" className="text-white/90">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@scheddy.us"
              autoComplete="email"
              required
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="password" className="text-white/90">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          {/* --- SMS consent (phone + checkbox + links) --- */}
          <SmsConsentInline />

          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>

          <p className="text-xs text-center text-white/80">
            Already have an account?{" "}
            <Link className="text-primary font-medium underline" href="/auth/sign-in">
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
