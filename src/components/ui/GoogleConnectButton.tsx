import Link from "next/link";

export function GoogleConnectButton({ returnTo = "/dashboard/settings/integrations" }: { returnTo?: string }) {
  const to = encodeURIComponent(returnTo);
  return (
    <Link
      href={`/api/google/oauth/start?returnTo=${to}`}
      className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
    >
      Connect Google Calendar
    </Link>
  );
}
