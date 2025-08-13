// app/lounge/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getSalesByArtist } from '@/features/bookings/services/getSalesByArtist'
import ArtistsBookingsGrid from '@/components/bookings/ArtistsBookingsGrid'

export default async function SalesPage() {


    // Get user info from the session
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    console.log("User Id", data.user.id )
    console.log("User Email", data.user.email)

    //get user bookings
    const bookings = await getSalesByArtist(data.user.id)
    console.log("SALES", bookings)

     return (
        <main className="p-6">
        {/* <h1 className="text-2xl font-bold mb-4">Welcome back, {profile.first_name}!</h1> */}
        <div className="text-left w-full"><h1 className="text-xl">Sales</h1></div>
      
        <ArtistsBookingsGrid bookings={bookings} />
        </main>
    )
}
// export default function Page() {
//     return (
//         <div>
//             <h1 className="text-xl p-4">Bookings</h1>
//             <div className="space-y-2 p-1 py-4 text-xs">
//                 <h2 className="text-sm">July</h2>
//                 <div className=" bg-[#3A3A3A] p-1 rounded">
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4">JUL<br></br>17</div>
//                     <div className="col-span-3 p-4">Wednesday, July 17<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
//                     <div className="col-span-2 p-4">Confirmed</div>
//                 </div>
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4"></div>
//                     <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
//                     <div className="col-span-2 p-4">$120.00</div>
//                 </div>
//                 </div>
//             </div>

//             <div className="space-y-2 p-1 py-4 text-xs">
//                 <div className=" bg-[#3A3A3A] p-1 rounded">
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4">JUL<br></br>18</div>
//                     <div className="col-span-3 p-4">Thursday, July 18<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
//                     <div className="col-span-2 p-4">Unconfirmed</div>
//                 </div>
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4"></div>
//                     <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
//                     <div className="col-span-2 p-4">$120.00</div>
//                 </div>
//                 </div>
//             </div>
//             <hr className="border-t border-[color:#3A3A3A]" />
//             <div className="space-y-2 p-1 py-4 text-xs">
//                 <h2 className="text-sm">July 2023</h2>
//                 <div className=" bg-[#3A3A3A] p-1 rounded">
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4">JUL<br></br>7</div>
//                     <div className="col-span-3 p-4">Monday, July 7<br></br><span className="text-[#808080]">9:00 AM - 11:00 AM</span></div>
//                     <div className="col-span-2 p-4">Completed</div>
//                 </div>
//                 <div className="grid grid-cols-6 gap-1">
//                     <div className="col-span-1 p-4"></div>
//                     <div className="col-span-3 p-4">Continuing Session<br></br><span className="text-[#808080]">2 hours - Austin Clark</span></div>
//                     <div className="col-span-2 p-4">$340.00</div>
//                 </div>
//                 </div>
//             </div>
//         </div>
//     );
// }