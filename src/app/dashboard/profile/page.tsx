import { createClient } from '@/utils/supabase/server'
import ProfileForm from '@/components/forms/users/ProfileForm'

export default async function Profile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user || userError) {
    return <div className="p-6">You must be logged in to view this page.</div>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Provide a base URL for the live preview (falls back if env missing)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ||
    'https://scheddy.us'

  return (
    <div className="p-6">
      <div className="py-3 text-[1.125rem]/[1.5rem] font-bold">Profile</div>

      {/* Full-width container; the form will render a two-column layout internally */}
      <ProfileForm
        userId={user.id}
        profile={profile ?? undefined}
        baseUrl={baseUrl}
      />
    </div>
  )
}
