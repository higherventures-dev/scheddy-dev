'use client'
import Image from "next/image"

export default function FeatureAlt() {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Everything you need in one place</h2>
        <p className="mt-4 text-gray-600 px-48">Scheddy combines scheduling, syncing, and team communication in one dashboard.Donec risus enim, maximus quis ante nec, aliquam convallis ipsum. Quisque ipsum massa, elementum sit amet dolor vel, vestibulum pulvinar ipsum. Sed volutpat velit eget tincidunt tempor. Cras sodales nibh sit amet erat vestibulum tempus. </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
        <div>
          <Image src="/features/calendar.svg" alt="Calendar" width={500} height={300} />
        </div>
        <div>
          <h3 className="text-3xl font-bold">Major Feature #1</h3>
          <p className="mt-4 text-gray-600">Cras sagittis accumsan sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas viverra neque pellentesque scelerisque laoreet.</p>
          <ul>
            <li>Vestibulum lacus sem, feugiat eget sem.</li>
            <li>Maecenas sodales eros ut vestibulum commodo.</li>
            <li>Maecenas viverra neque pellentesque.</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
        <div>
          <h3 className="text-3xl font-bold">Major Feature #2</h3>
          <p className="mt-4 text-gray-600">Cras sagittis accumsan sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas viverra neque pellentesque scelerisque laoreet.</p>
          <ul>
            <li>Vestibulum lacus sem, feugiat eget sem.</li>
            <li>Maecenas sodales eros ut vestibulum commodo.</li>
            <li>Maecenas viverra neque pellentesque.</li>
          </ul>
        </div>
          <div>
          <Image src="/features/calendar.svg" alt="Calendar" width={500} height={300} />
        </div>
      </div>
       <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
        <div>
          <Image src="/features/calendar.svg" alt="Calendar" width={500} height={300} />
        </div>
        <div>
          <h3 className="text-3xl font-bold">Major Feature #3</h3>
          <p className="mt-4 text-gray-600">Cras sagittis accumsan sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas viverra neque pellentesque scelerisque laoreet.</p>
          <ul>
            <li>Vestibulum lacus sem, feugiat eget sem.</li>
            <li>Maecenas sodales eros ut vestibulum commodo.</li>
            <li>Maecenas viverra neque pellentesque.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
