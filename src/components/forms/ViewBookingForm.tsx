'use client';

import { Booking } from '../BookingTable';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

export function ViewBookingForm({
  initialData,
  onClose,
}: {
  initialData: Booking;
  onClose: () => void;
}) {
  // Example: derive display values from initialData; replace with real fields
  const title = '[TITLE]';
const artist = '[ ARTIST ]';
   const dateDisplay = 'August 6, 2025'; // or format from initialData
  const timeDisplay = '9:00 am - 11:00 am'; // or derive from initialData
const status = 'Unconfirmed';
const price = '120';

  return (
    <div className="text-xs">
      {/* General Form */}
      <div className="space-y-4 p-1 py-4 text-xs">
        {/* Booking Information */}
        <div className="space-y-2 p-1 py-4 text-xs">
          <div className="bg-[#3A3A3A] p-4 rounded-lg">
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-1 rounded border border-gray-600">
                <div className="bg-gray-600 text-[70%] text-center">AUG</div>
                <div className="text-center text-[100%] pt-2 pb-2">06</div>
              </div>
              <div className="col-span-3 pl-4">
                {dateDisplay}
                <br />
                <span className="text-[#808080] text-[90%]">{timeDisplay}</span>
              </div>
              <div className="col-span-2 pr-1 text-right flex items-center justify-end">
                <span className="inline-flex items-center bg-[#344554] rounded-sm px-1">
                  <span className="text-[90%]">{status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-4">
              <div className="col-span-1 rounded border border-gray-600"></div>
              <div className="col-span-4 pl-4">
                {title}
                <br />
                <span className="text-[#808080] text-[90%]">{artist}</span>
              </div>
              <div className="col-span-1 pr-3 text-[90%]">{price}</div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <h2 className="text-sm">Payment</h2>
        <div className="space-y-2 text-white grid grid-cols-2">
          <div className="col-span-1 text-left">
            <span className="text-[color:#969696]">Total price</span>
          </div>
          <div className="col-span-1 text-right">
            <span className="text-[color:#969696]">$120.00</span>
          </div>
        </div>
        <div className="space-y-2 text-white grid grid-cols-2">
          <div className="col-span-1 text-left">
            <span className="text-[color:#969696]">Amount owed</span>
          </div>
          <div className="col-span-1 text-right">
            <span className="text-[color:#969696]">$120.00</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Booked By */}
        <h2 className="text-sm">Client</h2>
        <div className="grid grid-cols-2">
          <div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">999-999-9999</div>
          </div>
          <div>
            <div>Email</div>
            <div>client@scheddy.us</div>
          </div>
        </div>

        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Notes */}
        <h2 className="text-sm">Notes</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-[color:#969696]">[ NOTES ]</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Booked By */}
        <h2 className="text-sm">Booking Details</h2>
        <div className="grid grid-cols-2">
          <div className="col-span-1">Booked By</div>
          <div className="col-span-1">David S. On Oct 28 at 3:27 PM</div>
        </div>

        {/* Close Button */}
        <div>
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}