'use client'
export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">What Teams Are Saying</h2>
        <p className="mt-6 text-gray-600">Scheddy has transformed how we coordinate our team — no more chaos.</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <p className="italic">"Scheddy simplified our onboarding meetings and helped us scale faster."</p>
            <p className="mt-2 font-semibold">— Jordan, Ops Manager</p>
          </div>
          <div>
            <p className="italic">"We stopped missing deadlines once we adopted Scheddy. Huge win."</p>
            <p className="mt-2 font-semibold">— Alex, Product Lead</p>
          </div>
        </div>
      </div>
    </section>
  )
}
