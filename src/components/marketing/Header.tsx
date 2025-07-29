'use client'
import Link from "next/link"
import Image from "next/image";
import { Button } from "@/components/ui/button";
// NOTE
export default function Header() {
  return (
     <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-32 text-sm">
            <div className="flex flex-col p-5 flex">
            <Link href="/">
                <Image src="/logo.svg" alt="Scheddy" width={25} height={8} /> 
            </Link>
            </div>
            <div className="flex gap-5 items-center font-semibold">
            <Link href={"/about"}>About</Link>
            <Link href={"/features"}>Features</Link>
            <Link href={"/integrations"}>Integrations</Link>
            <Link href={"/pricing"}>Pricing</Link>
            <Link href={"/faqs"}>Faqs</Link>
            <Link href={"/contact"}>Contact</Link>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/auth/sign-in">Log in</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
          </div>
        </div>
    </nav>
  )
}
