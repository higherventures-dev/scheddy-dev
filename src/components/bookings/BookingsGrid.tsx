import type { Booking } from '@/lib/types/booking'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay'
import { getBookingStatusImage } from '@/lib/utils/getBookingStatusImage'
import { getBookingStatusInfo } from '@/lib/utils/getBookingStatusInfo'
import { string } from 'zod';

export default function BookingsGrid({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length) {
    return <p className="text-center text-gray-500 mt-8">No upcoming bookings.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {bookings.map((b) => {
        const date = new Date(b.start_time);
        const formattedLongDateWithDay = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

        const startDateTime = new Date(b.start_time);
        const bookingDurationDisplay = getDurationDisplay(b.start_time, b.end_time)
        const monthAbbr = startDateTime.toLocaleString('default', { month: 'short' }).toUpperCase();
        const dayOfMonth = startDateTime.getDate();
        const formattedStartTime = startDateTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        const endDateTime = new Date(b.end_time);
        const formattedEndTime = endDateTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        
      function getStatusText(status: number): string {
        switch (status) {
          case 0:
            return "Canceled";
          case 1:
            return "Unconfirmed";
          case 2:
            return "Confirmed";
          case 3:
            return "Completed";
          default:
            return "Unknown";
        }
}

const bookingStatus = getBookingStatusInfo(b.status); 

        //const durationHours = Math.round((end.getTime() - start.getTime()) / 3600000)
        // const statusCapitalized = b.status.charAt(0).toUpperCase() + b.status.slice(1)

        return (
          <div key={b.id} className="space-y-2 p-1 py-4 text-xs">
            <div className="bg-[#3A3A3A] p-4 rounded-lg">
              <div className="grid grid-cols-6 gap-1">
                <div className="col-span-1 rounded border border-gray-600">
                  <div className="bg-gray-600 text-[70%] text-center">
                    { monthAbbr}
                  </div>
                  <div className="text-center text-[100%] pt-2 pb-2">
                    { dayOfMonth}
                  </div>
                </div>
                <div className="col-span-3 pl-4">
                  {formattedLongDateWithDay}
                  <br />
                  <span className="text-[#808080] text-[90%]">
                    {formattedStartTime} - {formattedEndTime}
                  </span>
                </div>
         <div className="col-span-2 pr-1 text-right flex items-center justify-end">
  <span
  className="inline-flex items-center rounded-sm px-1"
  style={{ backgroundColor: bookingStatus.color || "transparent" }}
>  <Image
      src={bookingStatus.image}
      alt={bookingStatus.name}
      width={16}
      height={16}
      className="mr-1"
    />
    <span className="text-[90%]">{bookingStatus.name}</span>
  </span>
</div>         </div>
              <div className="grid grid-cols-6 gap-1 pt-4">
                <div className="col-span-1 rounded border border-gray-600 ">
                  <Image 
                    src="/assets/images/product.png" 
                    alt="" 
                    width={20} 
                    height={20} 
                    className="mx-auto pt-3 pb-3"
                  />
                </div>
                <div className="col-span-4 pl-4">
                  {b.title}
                  <br />  
                  <span className="text-[#808080] text-[90%]">
                    {b.artist?.first_name + ' ' + b.artist?.last_name + " - " + bookingDurationDisplay}
                  </span>
                </div>
                <div className="col-span-1 pr-3 text-[90%]">${b.price?.toFixed(2) ?? '0.00'}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
    
  )
}
