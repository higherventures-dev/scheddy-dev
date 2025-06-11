'use client'
export default function Features() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">All-in-One Scheduling Platform</h2>
        <p className="mt-4 text-gray-600">Scheddy gives you everything you need to manage, share, and sync schedules effortlessly.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold">Team Calendar Sync</h3>
            <p className="text-sm text-gray-500">Instantly align everyone's availability across tools.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Smart Reminders</h3>
            <p className="text-sm text-gray-500">Never miss another important event.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Auto Scheduling</h3>
            <p className="text-sm text-gray-500">Let Scheddy find the perfect time for your meetings.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
