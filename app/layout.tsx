import { ThemeProvider } from "next-themes";
import '@/styles/globals.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
  }: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ '${inter.className} antialiased'}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
      {children}
       </ThemeProvider></body>
    </html>
  );
}