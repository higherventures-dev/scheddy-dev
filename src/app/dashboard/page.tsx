// app/dashboard/page.tsx or similar
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSalesByArtist } from "@/features/bookings/services/getSalesByArtist";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();

  // Get user
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData?.user) {
    redirect("/login");
  }

  const artistName = userData.user.user_metadata?.first_name || "Artist";

  // Fetch current month bookings
  const bookings = await getSalesByArtist(userData.user.id, true);

  return (
    <DashboardClient artistName={artistName} bookings={bookings} />
  );
}
