import { createClient } from '@/utils/supabase/server'
import SideBar from '@/app/ui/dashboard/sidebar';
import ArtistSideBar from '@/app/ui/dashboard/artist-sidebar';
import StudioSideBar from '@/app/ui/dashboard/studio-sidebar';
import CustomerSideBar from '@/app/ui/dashboard/customer-sidebar';
import AdminSideBar from '@/app/ui/dashboard/admin-sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id;
    let UserSidebar = SideBar;

  if (userId) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const role = profile?.role?.toLowerCase();

    if (role === 'artist') UserSidebar = ArtistSideBar;
    else if (role === 'studio') UserSidebar = StudioSideBar;
    else if (role === 'customer') UserSidebar = CustomerSideBar;
    else if (role === 'admin') UserSidebar = AdminSideBar;
  }
    return (
    <div className="flex h-screen w-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-48 border-r">
        <UserSidebar />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}