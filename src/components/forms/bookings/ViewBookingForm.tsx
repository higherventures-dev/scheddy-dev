'use client';

import { useEffect, useState } from 'react';
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay';
import { updateBookingStatus } from '@/features/bookings/services/updateBookingStatus';
import { getBookingById } from '@/features/bookings/services/getBookingById';
import Image from 'next/image';
import BookingStatusSelect from '@/components/ui/BookingStatusSelect';
import { STATUS_OPTIONS, type StatusOption } from '@/lib/constants/statusOptions';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

import clsx from 'clsx';

export function ViewBookingForm({
  bookingId,
  onClose,
  onRefresh,
}: {
  bookingId: string;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [booking, setBooking] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(STATUS_OPTIONS[0] ?? null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch latest booking on drawer open
  useEffect(() => {
    const fetchBooking = async () => {
      const { data, error } = await getBookingById(bookingId);
      if (data) {
        setBooking(data);
        const matchingStatus = STATUS_OPTIONS.find(opt => opt.value === data.status) ?? null;
        setSelectedStatus(matchingStatus);
         console.log("BOOKING", data);
      }
    };

    fetchBooking();
  }, [bookingId]);

 
  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (!selectedStatus) throw new Error('Please select a status');
      const res = await updateBookingStatus(bookingId, selectedStatus.value);
      if (res?.error) throw new Error(res.error.message);

      setMessage('Status updated successfully!');
      setBooking((prev: any) => ({ ...prev, status: selectedStatus.value }));

      // ✅ Close drawer and refresh parent
      onRefresh();
      onClose();
    } catch (err: any) {
      setMessage(err.message || 'Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <div className="p-4 text-xs">Loading booking...</div>;

  // Extract values from the current booking
  const {
    title = '',
    first_name = '',
    last_name = '',
    phone_number = '',
    email_address = '',
    notes = '',
    price = '',
    start_time,
    end_time,
  } = booking;

  const startDate = new Date(start_time);
  const endDate = new Date(end_time);

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

  const bookingDurationDisplay = getDurationDisplay(startDate, endDate);
  
  return (
    <div>
      <div className="grid grid-cols-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold capitalize">{first_name} {last_name}</h2>
        </div>
        <div>
          <div className="col-span-2 pr-1 flex items-center justify-end">
            <BookingStatusSelect value={selectedStatus} onChange={setSelectedStatus} />
          </div>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div className="space-y-2 py-4 text-xs">
          <div>
            <div className="grid grid-cols-7 gap-1">
              <div className="col-span-1 rounded border border-gray-600">
                <div className="bg-gray-600 text-[70%] text-center">{monthAbbr}</div>
                <div className="text-center text-[100%] pt-2 pb-2">{dayOfMonth}</div>
              </div>
              <div className="col-span-6 pl-4">
                {formattedLongDateWithDay}
                <br />
                <span className="text-[#808080] text-[90%]">{formattedStartTime} - {formattedEndTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 pt-4">
              <div className="col-span-1 rounded border border-gray-600">
                <Image
                  src="/assets/images/product.png"
                  alt=""
                  width={20}
                  height={20}
                  className="mx-auto pt-3 pb-3"
                />
              </div>
              <div className="col-span-6 pl-4">
                {title}
                <br />
                <span className="text-[#808080] text-[90%]">{bookingDurationDisplay}</span>
              </div>
              <div className="col-span-1 pr-3 text-[90%]">
               
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />
        {/* Payment Info */}
        <h2 className="text-sm font-semibold">Payment</h2>
        <div className=" text-white grid grid-cols-2  grid-rows-2 text-[100%] gap-4">
          <div className="text-left">
            <span>Total price</span>
          </div>
          <div className="text-right">
            <span className="text-[color:#fff]">${price}</span>
          </div>
          <div className="text-left">
            <span className="text-[color:#fff]">Amount owed</span>
          </div>
          <div className="text-right">
            <span className="text-[color:#fff]">${price}</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Client Info */}
        <h2 className="text-sm font-semibold">Client</h2>
        <div className="grid grid-rows-2 grid-cols-2 gap-4">
          <div className="text-[#969696] flex">
             <PhoneIcon className="h-4 mr-2 text-[#969696]" />
             <span>Phone</span>
          </div>
          <div className="text-right">{phone_number}</div>
          <div className="text-[#969696] flex">
              <EnvelopeIcon className="h-4 mr-2 text-[#969696]" />
              <span>Email</span>
          </div>
          <div className="text-right">{email_address}</div>
        </div>

        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Notes */}
        <h2 className="text-sm font-semibold">Notes</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-[color:#969696]">{notes}</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        <div>
           <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gray-600 text-white text-xs rounded hover:bg-[#E5C26A] mr-4"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
        </div>
      </div>
    </div>
  );
}
