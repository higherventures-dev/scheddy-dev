// app/dashboard/bookings/page.tsx
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

import { getBookingsForArtistService } from '@/features/bookings/services/getBookingsForArtistService'
import { cancelBooking as cancelBookingService } from '@/features/bookings/services/cancelBooking'
import { getServicesByProfile } from '@/lib/actions/getServicesByProfile'

import BookingsGrid from '@/components/bookings/BookingsGrid'
import AddBookingDrawer from '@/components/bookings/AddBookingDrawer' // create (service -> details) drawer

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) redirect('/login')

  // Server action for cancel (used by the Cancel drawer)
  async function cancelBookingAction(formData: FormData) {
    'use server'
    const bookingId = formData.get('bookingId')
    if (!bookingId || typeof bookingId !== 'string') {
      throw new Error('Missing bookingId in form submission')
    }
    await cancelBookingService(bookingId)
    revalidatePath('/dashboard/bookings')
  }

  // Fetch bookings + services for this artist
  const [bookings, services] = await Promise.all([
    getBookingsForArtistService(data.user.id, data.user.email),
    getServicesByProfile(data.user.id),
  ])

  // If you have role metadata, use it; otherwise pick a sensible default.
  // e.g., const viewerRole = (data.user.user_metadata?.role as 'client'|'artist'|'admin') ?? 'artist'
  const viewerRole: 'client' | 'artist' | 'admin' = 'artist'

  // Ensure client-safe serialization for props passed to client components
  const plainServices = JSON.parse(JSON.stringify(services || []))
  const plainBookings = JSON.parse(JSON.stringify(bookings || []))

  return (
    <main className="p-6">
      <div className="p-2 relative">
        <div className="flex flex-col justify-between items-start">
          <div className="w-full flex justify-between items-center py-1">
            <div className="text-left">
               <h1 className="text-xl mb-6">Bookings</h1>
            </div>
            <div className="text-right font-bold">
              {/* Header “Create” button: opens the create drawer */}
              <AddBookingDrawer artistProfile={{ id: data.user.id }} services={plainServices} />
            </div>
          </div>

          <div className="flex gap-2 w-full text-left">
            {/* search input could go here */}
          </div>
        </div>
      </div>

      <BookingsGrid
        bookings={plainBookings}
        cancelAction={cancelBookingAction}
        services={plainServices}
        artistProfile={{ id: data.user.id }}
        viewerRole={viewerRole} // 'client' | 'artist' | 'admin' (Edit shows only for admin)
        // Optional: provide a real updater to enable Edit saves
        // onSaveEdit={async (id, payload) => {
        //   await updateBookingService(id, payload)
        // }}
      />
    </main>
  )
}
