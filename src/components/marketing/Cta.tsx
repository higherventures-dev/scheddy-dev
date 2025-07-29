'use client'
import Link from "next/link"

export default function Cta() {
  return (
    <section className="py-20 bg-indigo-600 text-white text-center">
      <h2 className="text-3xl font-bold">Ready to simplify scheduling?</h2>
      <p className="mt-4">Start using Scheddy for free today. No credit card required.</p>
      <div className="mt-6">
        <Link href="/register">
          <span className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium">Get Started</span>
        </Link>
      </div>
    </section>
  )
}
