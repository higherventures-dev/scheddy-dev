import { createClient } from '@/utils/supabase/server';
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Header from '@/components/header-auth';
import Footer from '@/components/dashboard/footer';
import SideBar from '@/ui/dashboard/sidebar';
import ArtistSideBar from '@/ui/dashboard/artist-sidebar';
import StudioSideBar from '@/ui/dashboard/studio-sidebar';
import CustomerSideBar from '@/ui/dashboard/customer-sidebar';
import AdminSideBar from '@/ui/dashboard/admin-sidebar';
import Image from 'next/image';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Scheddy",
  description: "The #1 Tattoo Artist Management System",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // ✅ Use secure method to fetch authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const userId = user?.id;
  let UserSidebar = SideBar;

  // Fetch profile with additional fields for business_name, first_name, last_name, logo_url
  let profile: {
    role?: string;
    business_name?: string;
    first_name?: string;
    last_name?: string;
    logo_url?: string;
  } | null = null;

  if (userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, business_name, first_name, last_name, logo_url')
      .eq('id', userId)
      .single();
    profile = data;

    const role = profile?.role?.toLowerCase();

    if (role === 'artist') UserSidebar = ArtistSideBar;
    else if (role === 'studio') UserSidebar = StudioSideBar;
    else if (role === 'client') UserSidebar = CustomerSideBar;
    else if (role === 'admin') UserSidebar = AdminSideBar;
  }

  // Determine display name and image source
  const displayName =
    profile?.business_name && profile.business_name.trim() !== ''
      ? profile.business_name
      : `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';

  const logoSrc = profile?.logo_url && profile.logo_url.trim() !== ''
    ? profile.logo_url
    : '/assets/images/business-avatar.png';

  return (
    <main className={`min-h-screen flex flex-col items-center ${inter.variable} font-sans`}>
      <div className="flex h-screen w-screen flex-col md:flex-row md:overflow-hidden bg-[#1A1A1A]">
        <div className="w-full flex-none md:w-48 border-r py-6 px-2">
          <div className="flex items-center gap-2 text-xs py-1 px-3 pb-5 border-b-gray-100">
            <Image
              src={logoSrc}
              alt={displayName}
              width={20}
              height={20}
              className="rounded"
              unoptimized={true} // remove if using next.config.js domains
            />
            {displayName}
          </div>
          <UserSidebar />
        </div>
        <div className="flex-grow p-4 md:overflow-y-auto md:p-4 bg-[#262626]">
          <Header>{children}</Header>
          <div className="border border-[#313131] mt-2"></div>
          {children}
        </div>
      </div>
    </main>
  );
}
