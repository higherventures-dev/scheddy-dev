import { createClient } from "@/utils/supabase/client"; // adjust to your supabase helper path
import { Service } from "@/lib/types/service"; // if you have a Profile type defined

export async function getServicesByProfile(profile_id: string): Promise<Service[] | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("profile_id", profile_id)

  if (error) {
    console.error("Error fetching services by profile:", error);
    return null;
  }

  return data;
}