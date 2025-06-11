'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Header />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  )
}