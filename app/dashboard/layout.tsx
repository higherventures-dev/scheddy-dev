import { createClient } from '@/utils/supabase/server'
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { inter } from '@/app/ui/fonts';
import Header from '@/components/header-auth'
import Footer from '@/components/dashboard/footer'
import SideBar from '@/ui/dashboard/sidebar';
import ArtistSideBar from '@/ui/dashboard/artist-sidebar';
import StudioSideBar from '@/ui/dashboard/studio-sidebar';
import CustomerSideBar from '@/ui/dashboard/customer-sidebar';
import AdminSideBar from '@/ui/dashboard/admin-sidebar';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Scheddy",
  description: "The #1 Tatto Artist Management System",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id;
    let UserSidebar = SideBar;

    if (userId) 
    {
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
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex h-screen w-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-48 border-r py-6 px-2">
            <div className="text-sm items-right py-4">[ ARTIST/STUDIO BRAND ]</div>
            <UserSidebar />
          </div>
          <div className="flex-grow p-4 md:overflow-y-auto md:p-4">
              <Header>
                {children}
              </Header>
            {children}
          </div>
        </div>
        <Footer />
      </main>
    );
}