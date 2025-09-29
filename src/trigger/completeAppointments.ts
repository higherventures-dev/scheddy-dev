import { schedules } from "@trigger.dev/sdk";
import { createClient } from "@supabase/supabase-js";

export const completeAppointments = schedules.task({
  id: "complete-appointments-daily",
  // Run every day at 00:00 America/Los_Angeles (DST-safe)
  cron: { pattern: "0 0 * * *", timezone: "America/Los_Angeles" },

  // optional: ensure only one run at a time
  // concurrency: { limit: 1 },

  run: async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only secret
    );

    // Compute yesterday (LA) and update records that ended yesterday & are still confirmed
    const la = "America/Los_Angeles";
    const nowLA = new Date(new Date().toLocaleString("en-US", { timeZone: la }));
    const y = new Date(nowLA);
    y.setDate(nowLA.getDate() - 1);

    // Start/end of yesterday in LA
    const startLA = new Date(`${y.toISOString().slice(0,10)}T00:00:00`);
    const endLA   = new Date(`${y.toISOString().slice(0,10)}T23:59:59`);

    // ends_at: timestamp (UTC), status: 'confirmed'|'completed'
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: 5})
      .gte("end_time", startLA.toISOString())
      .lte("end_time", endLA.toISOString())
      .eq("status", 2)
      .select("id");

    if (error) throw error;
    console.log(`Completed ${data?.length ?? 0} appointments`);
  },
});
