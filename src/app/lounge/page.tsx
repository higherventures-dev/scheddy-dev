// app/lounge/page.tsx
import { getUserIdFromSession } from '@/features/users/services/getUserIdFromSession'
import { getUserProfile } from '@/features/users/services/getUserProfile'
import { getBookingsForUserService } from '@/features/bookings/services/getBookingsForUserService'
import BookingsGrid from '@/components/bookings/BookingsGrid'

export default async function LoungePage() {

    // Get user info from the session
    const userId = await getUserIdFromSession()
    if (!userId) {
        // Redirect to login or show error
        throw new Error('User not authenticated')
    }

    //get user profile
    console.log('lounge call with userId:', userId)
    //const user = await getUserProfile(userId)

    //get user bookings
    const bookings = await getBookingsForUserService(userId)

     return (
        <main className="p-6">
        {/* <h1 className="text-2xl font-bold mb-4">Welcome back, {user.firstName}!</h1> */}
        <BookingsGrid bookings={bookings} />
        </main>
    )
}