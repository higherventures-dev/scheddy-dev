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
          <div key={b.id}>
            {/* Optionally: you could group by month here */}
            {/* <h2 className="text-sm">{monthAbbr}</h2> */}

            <div className="bg-[#3A3A3A] p-1 rounded">
              <div className="grid grid-cols-6 gap-1">
                <div className="col-span-1 p-4">
                  {monthAbbr}<br />{dayOfMonth}
                </div>
                <div className="col-span-3 p-4">
                  {formattedLongDateWithDay}<br />
                  <span className="text-[#808080]">{formattedStartTime} - {formattedEndTime}</span>
                </div>
                <div className="col-span-2 p-4 flex items-center gap-1">
                  <Image
                    src={getBookingStatusImage(b.status)}
                    alt={formattedStatus}
                    width={16}
                    height={16}
                  />
                  {formattedStatus}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1">
                <div className="col-span-1 p-4" />
                <div className="col-span-3 p-4">
                  {b.title}<br />
                  <span className="text-[#808080]">
                    {bookingDurationDisplay} - {artistName}
                  </span>
                </div>
                <div className="col-span-2 p-4">
                  ${b.price?.toFixed(2) ?? '0.00'}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
