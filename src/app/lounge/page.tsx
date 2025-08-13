// app/lounge/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getBookingsForUserService } from '@/features/bookings/services/getBookingsForUserService'
import BookingsGrid from '@/components/bookings/BookingsGrid'


export default async function LoungePage() {


    // Get user info from the session
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    //get user bookings
    const bookings = await getBookingsForUserService(data.user.id, data.user.email)

     return (
        <main className="p-6">
            <BookingsGrid bookings={bookings} />
        </main>
    )
}