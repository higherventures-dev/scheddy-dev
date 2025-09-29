// components/DisconnectButton.tsx
"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DisconnectButton() {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        start(async () => {
          await fetch("/api/google/disconnect", { method: "POST" });
          router.refresh(); // re-fetches server component data (status)
        })
      }
      disabled={pending}
      className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
    >
      {pending ? "Disconnecting..." : "Disconnect"}
    </button>
  );
}
