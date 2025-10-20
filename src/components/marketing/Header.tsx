'use client'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-32 text-sm">
        {/* Brand */}
        <div className="flex items-center p-5">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/images/logo.svg" alt="Scheddy" width={18} height={18} />
            <span className="text-xl leading-none">scheddy</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/about">About</Link>
          <Link href="/features">Features</Link>
          <Link href="/integrations">Integrations</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faqs">Faqs</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/auth/sign-in">Log in</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
