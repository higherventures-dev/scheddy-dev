export const metadata = {
  title: 'Scheddy SMS Program',
  description: 'Learn about Scheddy’s SMS reminder program and your rights.'
}

export default function SmsPage() {
  return (
    <main className="prose max-w-3xl mx-auto py-12 px-4">
      <h1>Scheddy SMS Messaging Program</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Program Description</h2>
      <p>
        Scheddy’s text message program provides appointment reminders, schedule
        updates, and customer care messages to users who have opted in. Message
        frequency varies based on your appointments and activity.
      </p>

      <h2>Opt-In Information</h2>
      <p>
        You can opt in by checking the SMS consent box during sign-up or when
        scheduling an appointment. You will then receive a message asking you to
        confirm by replying <strong>YES</strong>.
      </p>

      <h2>Opt-Out Instructions</h2>
      <p>
        To stop receiving text messages, reply <strong>STOP</strong> to any
        Scheddy message. You may also text <strong>UNSTOP</strong> or{' '}
        <strong>START</strong> to re-subscribe.
      </p>

      <h2>Help & Support</h2>
      <p>
        For help, reply <strong>HELP</strong> or contact us at{' '}
        <a href="mailto:support@scheddy.com">support@scheddy.com</a>.
      </p>

      <h2>Message Frequency</h2>
      <p>
        Message frequency varies. Typically 2–8 messages per month depending on
        your appointment volume.
      </p>

      <h2>Carrier Disclaimer</h2>
      <p>
        Carriers are not liable for delayed or undelivered messages. Message and
        data rates may apply.
      </p>

      <h2>Privacy</h2>
      <p>
        See our full <a href="/privacy">Privacy Policy</a> to learn how we
        handle and protect your data.
      </p>

      <h2>Contact</h2>
      <p>
        Scheddy Support<br />
        <a href="mailto:support@scheddy.com">support@scheddy.com</a>
      </p>
    </main>
  );
}
