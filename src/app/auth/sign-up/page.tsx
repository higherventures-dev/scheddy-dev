import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import Image from "next/image";
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
        id="signup-form"
        noValidate
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
        {/* Brand row: logo to the left of the word "scheddy" */}
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/images/logo.svg"
            alt="Scheddy logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          <h1 className="text-xl font-medium text-white">scheddy</h1>
        </div>

        <h4 className="text-[11px] text-center text-white/80 mt-1">
          Create your account below.
        </h4>

        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="firstname" className="text-white/90">
                First Name
              </Label>
              <Input
                id="firstname"
                name="firstname"
                autoComplete="given-name"
                required
                aria-describedby="firstname-error"
              />
              <p id="firstname-error" className="text-[11px] text-red-400 mt-1 hidden"></p>
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="lastname" className="text-white/90">
                Last Name
              </Label>
              <Input
                id="lastname"
                name="lastname"
                autoComplete="family-name"
                required
                aria-describedby="lastname-error"
              />
              <p id="lastname-error" className="text-[11px] text-red-400 mt-1 hidden"></p>
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
              inputMode="numeric"
              placeholder="(555) 555-5555"
              autoComplete="tel-national"
              required
              aria-describedby="phone-error"
              pattern="\(\d{3}\)\s\d{3}-\d{4}"
              title="Enter a 10-digit U.S. phone number like (555) 555-5555"
            />
            {/* hidden normalized +1E164 for the server action */}
            <input id="phone_e164" name="phone_e164" type="hidden" />
            <p id="phone-error" className="text-[11px] text-red-400 mt-1 hidden"></p>
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
              aria-describedby="email-error"
            />
            <p id="email-error" className="text-[11px] text-red-400 mt-1 hidden"></p>
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
              aria-describedby="password-error"
            />
            <p id="password-error" className="text-[11px] text-red-400 mt-1 hidden"></p>
          </div>

          {/* --- SMS consent (phone + checkbox + links) --- */}
          <SmsConsentInline />

          <SubmitButton
  formAction={signUpAction}
  pendingText="Signing up..."
  className="mt-3 !h-10 !px-4 !py-2 !text-base !font-medium !rounded-md"
>
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

      {/* ---- Inline behavior: digit-only phone, auto-format, descriptive errors ---- */}
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
(() => {
  const $ = (id) => document.getElementById(id);
  const form = $('signup-form');
  if (!form) return;

  const first = $('firstname');
  const last  = $('lastname');
  const email = $('email');
  const pass  = $('password');
  const phone = $('phone');
  const phoneE = $('phone_e164');

  const err = {
    firstname: $('firstname-error'),
    lastname:  $('lastname-error'),
    email:     $('email-error'),
    password:  $('password-error'),
    phone:     $('phone-error')
  };

  // ---- Phone formatting helpers ----
  const onlyDigits = (s) => (s || '').replace(/\\D/g, '');
  const fmtUS = (s) => {
    const d = onlyDigits(s).slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 7) return '(' + d.slice(0,3) + ') ' + d.slice(3,6);
    return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6,10);
  };
  const toE164 = (s) => {
    const d = onlyDigits(s).slice(0, 10);
    return d.length === 10 ? '+1' + d : '';
  };
  const syncPhone = () => {
    phone.value = fmtUS(phone.value);
    phoneE.value = toE164(phone.value);
  };

  // Digit-only typing & paste
  phone.addEventListener('beforeinput', (e) => {
    if (typeof e.data === 'string' && /\\D/.test(e.data)) e.preventDefault();
  });
  phone.addEventListener('input', syncPhone);
  phone.addEventListener('paste', (e) => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData('text');
    phone.value = fmtUS(t);
    syncPhone();
  });

  // Initialize once in case of autofill
  syncPhone();

  // ---- Error helpers ----
  const show = (el, msg) => { if (!el) return; el.textContent = msg || ''; el.classList.toggle('hidden', !msg); };
  const clearAll = () => {
    Object.values(err).forEach((el) => show(el, ''));
    [first,last,email,pass,phone].forEach((el) => el && el.setCustomValidity(''));
  };

  const validateField = (name) => {
    switch (name) {
      case 'firstname': {
        const ok = !!(first && first.value.trim());
        first.setCustomValidity(ok ? '' : 'Please enter your first name.');
        show(err.firstname, ok ? '' : 'Please enter your first name.');
        return ok;
      }
      case 'lastname': {
        const ok = !!(last && last.value.trim());
        last.setCustomValidity(ok ? '' : 'Please enter your last name.');
        show(err.lastname, ok ? '' : 'Please enter your last name.');
        return ok;
      }
      case 'email': {
        const v = (email && email.value.trim()) || '';
        let msg = '';
        if (!v) msg = 'Please enter your email address.';
        else if (!/^([^\\s@]+)@([^\\s@]+)\\.[^\\s@]+$/.test(v)) msg = 'That email doesn\\u2019t look right. Try again.';
        email.setCustomValidity(msg);
        show(err.email, msg);
        return !msg;
      }
      case 'password': {
        const v = (pass && pass.value) || '';
        const ok = v.length >= 6;
        pass.setCustomValidity(ok ? '' : 'Password must be at least 6 characters.');
        show(err.password, ok ? '' : 'Password must be at least 6 characters.');
        return ok;
      }
      case 'phone': {
        syncPhone();
        const ok = /^\\+1\\d{10}$/.test(phoneE.value);
        const msg = ok ? '' : 'Enter a valid U.S. phone number (10 digits).';
        phone.setCustomValidity(msg);
        show(err.phone, msg);
        return ok;
      }
    }
    return true;
  };

  // Blur validations
  [first,last,email,pass,phone].forEach((el) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el.name === 'phone' ? 'phone' : el.name));
    el.addEventListener('input', () => {
      el.setCustomValidity('');
      const key = el.name === 'phone' ? 'phone' : el.name;
      show(err[key], '');
    });
  });

  // Submit guard
  form.addEventListener('submit', (e) => {
    clearAll();
    const ok =
      validateField('firstname') &
      validateField('lastname') &
      validateField('phone') &
      validateField('email') &
      validateField('password');

    if (!ok) {
      e.preventDefault();
      const order = [first,last,phone,email,pass];
      for (const el of order) {
        if (!el) continue;
        if (!el.checkValidity()) { el.focus(); break; }
      }
    }
  });
})();
          `,
        }}
      />
    </>
  );
}
