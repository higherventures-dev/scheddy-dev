'use client'
import Link from "next/link"

export default function Header() {
  return (
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
        </div>
    </nav>
  )
}
