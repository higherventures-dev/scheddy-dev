'use client'
export default function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold">Everything in One Place</h2>
          <p className="mt-4 text-gray-600">Scheddy combines scheduling, syncing, and team communication in one dashboard.</p>
        </div>
        <ul className="space-y-6">
          <li>✔ Easy calendar integration</li>
          <li>✔ Smart event coordination</li>
          <li>✔ Real-time team updates</li>
        </ul>
      </div>
    </section>
  )
}
