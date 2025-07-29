import { createClient } from "@/utils/supabase/client"; // adjust to your supabase helper path
import { Profile } from "@/types"; // if you have a Profile type defined

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single(); // only one expected

  if (error) {
    console.error("Error fetching profile by slug:", error);
    return null;
  }

  return data;
}