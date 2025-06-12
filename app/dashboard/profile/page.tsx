import { createClient } from "@/utils/supabase/server";
import ProfileForm from "@/forms/profile";
export default async function Profile() {
const supabase = await createClient();

// Step 1: Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return <div>You must be logged in to view this page.</div>;
  }

  if (!user) {
    // optionally redirect to login or show unauthorized
    return <div>You must be logged in to view this page.</div>;
  }

  // fetch their profile here if needed
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

return ( <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <ProfileForm userId={user.id} profile={profile} />
    </div>
);
}
    