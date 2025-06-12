'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="text-left py-36 px-36  w-1/2">
      <h1 className="text-4xl font-bold">Run A Better Tattoo Business with Scheddy<sup className="text-xs align-super">TM</sup></h1>
      <p className="mt-4 text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget eros vestibulum, eleifend neque sit amet, suscipit libero. Nullam pharetra leo nec leo malesuada auctor.</p>
    <div className="flex gap-2 py-4">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/about">Learn More</Link>
      </Button>
    </div>
    </section>
  )
}
