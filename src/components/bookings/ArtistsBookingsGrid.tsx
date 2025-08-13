  import type { Booking } from '@/lib/types/booking'
  import { getDurationDisplay } from '@/lib/utils/getDurationDisplay'
  import { getBookingStatusInfo } from '@/lib/utils/getBookingStatusInfo'

  export default function ArtistsBookingsGrid({ bookings }: { bookings: Booking[] }) {
    if (!bookings.length) {
      return <p className="text-center text-gray-500 mt-8">No upcoming bookings.</p>
    }

    // Calculate grand total
    const grandTotal = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

    return (
      <div className="w-full space-y-2 p-1 py-4 text-xs">
        {/* Column Headers */}
        <div className="grid grid-cols-5 gap-1 font-semibold border-b pb-2 mb-2 text-[#808080]">
          <div>Status</div>
          <div>Date</div>
          <div>Client</div>
          <div>Service</div>
          <div className="text-right pr-2">Total</div>
        </div>

        {/* Booking Rows */}
        {bookings.map((b) => {
          const startDate = new Date(b.start_time);
          const formattedLongDateWithDay = startDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const formattedStatus = getBookingStatusInfo(b.status).name;
          const clientName = b.client ? `${b.client.first_name} ${b.client.last_name}` : '';

          return (
            <div key={b.id} className="border p-2 shadow-sm hover:shadow-md transition">
              <div className="grid grid-cols-5 gap-1">
                <div>{formattedStatus}</div>
                <div>{formattedLongDateWithDay}</div>
                <div>{clientName}</div>
                <div>{b.title}</div>
                <div className="text-right">${b.price?.toFixed(2) ?? '0.00'}</div>
              </div>
            </div>
          );
        })}

        {/* Grand Total Footer */}
        <div className="grid grid-cols-5 gap-1 font-semibold border-t pt-4 border-dotted border-[#3A3A3A] pr-2 mt-4 text-[#69AADE]">
          <div></div>
          <div></div>
          <div className="text-right"></div>
          <div className="text-right"></div>
          <div className="text-right">Total: ${grandTotal.toFixed(2)}</div>
        </div>
      </div>
    );
  }
