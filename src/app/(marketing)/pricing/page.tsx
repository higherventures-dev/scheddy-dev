'use client'
import Link from "next/link"

export default function PricingPage() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Simple Pricing</h1>
        <p className="mb-10 text-gray-600">No hidden fees. Just straightforward plans that grow with your team.</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Free</h2>
            <p className="mb-4">For individuals</p>
            <ul className="text-sm text-gray-600 mb-6">
              <li>✔ 1 calendar</li>
              <li>✔ Basic scheduling</li>
            </ul>
            <Link href="/register" className="text-indigo-600 font-medium">Get Started</Link>
          </div>
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-2">Pro</h2>
            <p className="mb-4">Best for teams</p>
            <ul className="text-sm text-gray-600 mb-6">
              <li>✔ Unlimited calendars</li>
              <li>✔ Team syncing</li>
              <li>✔ Smart reminders</li>
            </ul>
            <Link href="/register" className="text-indigo-600 font-medium">Try Pro</Link>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
            <p className="mb-4">Custom needs</p>
            <ul className="text-sm text-gray-600 mb-6">
              <li>✔ Dedicated support</li>
              <li>✔ Custom integrations</li>
            </ul>
            <Link href="/contact" className="text-indigo-600 font-medium">Contact Sales</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
