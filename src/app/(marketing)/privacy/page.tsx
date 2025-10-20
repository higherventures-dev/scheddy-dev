export const metadata = {
  title: "Privacy Policy | Scheddy",
  description:
    "Scheddy Privacy Policy explaining how we collect, use, and protect data.",
};

export default function PrivacyPage() {
  return (
    <main
      className="
        prose max-w-3xl mx-auto py-6 px-4
        prose-headings:font-semibold
        no-underline                           /* reset any inherited underline */

        /* Paragraphs: size, spacing, color, and no underline */
        prose-p:text-[10px] md:prose-p:text-[11px]
        prose-p:leading-6
        prose-p:my-6
        prose-p:text-slate-300
        [&_p]:!no-underline
        [&_p_a]:!no-underline
        prose-a:text-slate-200

        /* Lists: compact, same small size/color, no underline on items/links */
        prose-ul:my-4 prose-ol:my-4
        prose-li:text-[10px] md:prose-li:text-[11px]
        prose-li:my-1.5
        prose-li:text-slate-300
        [&_li]:!no-underline
        [&_li_a]:!no-underline
        [&_ul]:pl-5 [&_ol]:pl-5

        /* Smaller headers; white text with white underline */
        [&_h1]:text-base md:[&_h1]:text-lg
        [&_h2]:text-sm md:[&_h2]:text-base
        [&_h1]:underline [&_h2]:underline
        [&_h1]:underline-offset-6 [&_h2]:underline-offset-6
        [&_h1]:decoration-2 [&_h2]:decoration-2
        [&_h1]:text-white [&_h2]:text-white
        [&_h1]:decoration-white [&_h2]:decoration-white

        /* Extra space before each section */
        [&_h2]:mt-6
      "
    >
      <h1>Privacy Policy</h1>
      <p className="text-[10px] md:text-[11px] text-slate-400 no-underline">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <h2>1. Overview</h2>
      <p>
        Scheddy (“we,” “our,” or “us”) values your privacy. This policy explains
        how we collect, use, and protect your information when you use our
        website, app, or text messaging services.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li>Personal identifiers (name, email, phone number)</li>
        <li>Appointment details you provide</li>
        <li>SMS opt-in/opt-out preferences</li>
        <li>Technical data (browser type, IP address)</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To send reminders and scheduling updates</li>
        <li>To improve our services and support</li>
        <li>To comply with laws and carrier regulations</li>
      </ul>

      <h2>4. SMS Communications</h2>
      <p>
        When you opt in, we collect and store your consent (including timestamp,
        IP, and source). You may revoke consent at any time by replying STOP.
        HELP replies return contact and opt-out info.
      </p>

      <h2>5. Data Protection</h2>
      <p>
        We use Supabase for secure data storage and encryption. Access to your
        personal data is limited to authorized personnel and system processes
        only.
      </p>

      <h2>6. Data Sharing</h2>
      <p>
        We do not sell or rent your data. We may share data with trusted vendors
        (like Twilio for SMS) solely to operate the Scheddy platform.
      </p>

      <h2>7. Your Rights</h2>
      <ul>
        <li>Access, correct, or delete your data</li>
        <li>Withdraw SMS consent (reply STOP)</li>
        <li>
          Request a copy of your data by emailing{" "}
          <a href="mailto:support@scheddy.com">support@scheddy.com</a>
        </li>
      </ul>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Changes will be posted
        here with an updated effective date.
      </p>

      <p>
        Questions? Contact us at{" "}
        <a href="mailto:privacy@scheddy.us">privacy@scheddy.us</a>.
      </p>
    </main>
  );
}
