'use client'
export default function ContactPage() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="mb-8 text-gray-600">Need support or have a question? Reach out and we’ll respond as soon as possible.</p>
        <form className="space-y-6">
          <input type="text" placeholder="Name" className="w-full border px-4 py-2 rounded" />
          <input type="email" placeholder="Email" className="w-full border px-4 py-2 rounded" />
          <textarea placeholder="Message" rows={5} className="w-full border px-4 py-2 rounded" />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">Send</button>
        </form>
      </div>
    </section>
  )
}
