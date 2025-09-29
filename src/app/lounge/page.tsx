import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { getBookingsForUserService } from '@/features/bookings/services/getBookingsForUserService'
import { cancelBooking as cancelBookingService } from '@/features/bookings/services/cancelBooking'
import BookingsGrid from '@/components/bookings/BookingsGrid'

export default async function LoungePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) redirect('/login')

  // IMPORTANT: accept FormData and read 'bookingId'
  async function cancelBookingAction(formData: FormData) {
    'use server'
    const bookingId = formData.get('bookingId')
    if (!bookingId || typeof bookingId !== 'string') {
      throw new Error('Missing bookingId in form submission')
    }

    await cancelBookingService(bookingId)
    revalidatePath('/lounge')
  }

  const bookings = await getBookingsForUserService(data.user.id, data.user.email)

  return (
    <main className="p-6">
      <BookingsGrid bookings={bookings} cancelAction={cancelBookingAction} />
    </main>
  )
}
