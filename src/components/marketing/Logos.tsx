'use client'
import Image from "next/image"

export default function Logos() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8">
        <Image src="/logos/logo-google.svg" alt="Google" width={100} height={30} />
        <Image src="/logos/logo-shopify.svg" alt="Shopify" width={100} height={30} />
        <Image src="/logos/logo-slack.svg" alt="Slack" width={100} height={30} />
      </div>
    </section>
  )
}
