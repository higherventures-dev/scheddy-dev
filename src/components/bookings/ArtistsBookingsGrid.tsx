import type { Booking } from '@/lib/types/booking'
import Image from 'next/image';
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay'
import { getBookingStatusImage } from '@/lib/utils/getBookingStatusImage'

export default function ArtistsBookingsGrid({ bookings }: { bookings: Booking[] }) {
  if (!bookings.length) {
    return <p className="text-center text-gray-500 mt-8">No upcoming bookings.</p>
  }

  function getStatusText(status: number): string {
    switch (status) {
      case -1:
        return "Canceled";
      case 0:
        return "Unconfirmed";
      case 1:
        return "Confirmed";
      case 2:
        return "Completed";
      default:
        return "Unknown";
    }
  }

  return (
    <div className="space-y-2 p-1 py-4 text-xs">
        
      {bookings.map((b) => {
        const startDate = new Date(b.start_time);
        const endDate = new Date(b.end_time);

        const formattedLongDateWithDay = startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const monthAbbr = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const dayOfMonth = startDate.getDate();

        const formattedStartTime = startDate.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        const formattedEndTime = endDate.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        const bookingDurationDisplay = getDurationDisplay(b.start_time, b.end_time);
        const formattedStatus = getStatusText(b.status);
        const artistName = b.artist ? `${b.artist.first_name} ${b.artist.last_name}` : '';

        return (    
            <div className="border p-2 shadow-sm hover:shadow-md transition">
              <div className="grid grid-cols-6 gap-1">
                <div>
                  #{b.id}
                </div>
                <div>
                  {formattedStatus}
                </div>
                <div>
                  {formattedLongDateWithDay}<br />
                </div>
                <div>
                  CLIENT
                </div>
                <div>
                  ${b.price?.toFixed(2) ?? '0.00'}
                </div>
                <div>
                  ...
                </div>
              </div>
            </div>
        )
      })}
    </div>
  )
}
