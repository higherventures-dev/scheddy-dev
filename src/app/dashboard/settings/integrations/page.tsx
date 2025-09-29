// app/dashboard/settings/integrations/page.tsx
import { headers } from "next/headers";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";
import DisconnectButton from "@/components/ui/GoogleDisconnectButton";

export const dynamic = "force-dynamic"; // avoid static caching

async function getGoogleStatus() {
  const cookie = headers().get("cookie") ?? "";
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google/status`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return { connected: false };
  return res.json();
}

export default async function IntegrationsPage() {
  const status = await getGoogleStatus();

  return (
    <div className="max-w-2xl space-y-6 p-4">
      <h1 className="text-xl font-semibold">Integrations</h1>

      <div className="rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Google Calendar</div>
            {status.connected ? (
              <p className="text-sm text-neutral-600">
                Connected as <span className="font-medium">{status.email}</span>
                {status.calendarId !== "primary"
                  ? ` · Calendar: ${status.calendarId}`
                  : " · Calendar: primary"}
              </p>
            ) : (
              <p className="text-sm text-neutral-600">Not connected</p>
            )}
          </div>

          {status.connected ? <DisconnectButton /> : <GoogleConnectButton />}
        </div>

        {!status.connected && (
          <p className="mt-3 text-xs text-neutral-500">
            Connecting lets Scheddy automatically add, update, and remove your
            appointments in Google Calendar.
          </p>
        )}
      </div>
    </div>
  );
}
