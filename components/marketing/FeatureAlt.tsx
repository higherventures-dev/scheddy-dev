'use client'
import Image from "next/image"

export default function FeatureAlt() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold">Built for Busy Teams</h2>
          <p className="mt-4 text-gray-600">No more back-and-forth emails. With Scheddy, collaboration becomes natural and efficient.</p>
        </div>
        <div>
          <Image src="/features/calendar.svg" alt="Calendar" width={500} height={300} />
        </div>
      </div>
    </section>
  )
}
