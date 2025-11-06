// app/layout.tsx
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.scheddy.us"),
  title: "scheddy",
  description: "…",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* BugHerd on all pages */}
        <Script
          id="bugherd"
          src={`https://www.bugherd.com/sidebarv2.js?apikey=${process.env.NEXT_PUBLIC_BUGHERD_API_KEY}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
