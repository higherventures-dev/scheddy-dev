import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { inter } from '@/app/ui/fonts';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

  return (

    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className={ '${inter.className} antialiased'}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
        <>
    </>

          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex flex-col p-5 flex">
                    <Link href={"/"}>[ Scheddy Logo]</Link>
                  </div>
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/about"}>About</Link>
                    <Link href={"/features"}>Features</Link>
                    <Link href={"/integrations"}>Integrations</Link>
                    <Link href={"/pricing"}>Pricing</Link>
                    <Link href={"/faqs"}>Faqs</Link>
                    <Link href={"/contact"}>Contact</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col p-5 w-full flex">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                 &copy; 2025 Scheddy Inc. | <Link href={"/privacy"}>/Privacy Policy</Link> | <Link href={"/terms"}>/Terms of Use</Link> | <Link href={"/contact"}>/Support</Link>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
