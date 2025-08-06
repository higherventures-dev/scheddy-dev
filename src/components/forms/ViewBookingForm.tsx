'use client';

import { useEffect, useState } from 'react';
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay';
import { updateBookingStatus } from '@/features/bookings/services/updateBookingStatus';
import { getBookingById } from '@/features/bookings/services/getBookingById';
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
  const STATUS_OPTIONS = [
    { value: -1, label: 'Canceled' },
    { value: 0, label: 'Unconfirmed' },
    { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Completed' },
    { value: 3, label: 'No-Show' },
  ];

  const [booking, setBooking] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch latest booking on drawer open
  useEffect(() => {

    const fetchBooking = async () => {
      const { data, error } = await getBookingById(bookingId);
      if (data) {
        setBooking(data);
        setSelectedStatus(data.status ?? 0);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleSave = async () => {
  setLoading(true);
  setMessage('');

  try {
    const res = await updateBookingStatus(bookingId, selectedStatus);
    if (res?.error) throw new Error(res.error.message);

    setMessage('Status updated successfully!');
    setBooking((prev: any) => ({ ...prev, status: selectedStatus }));

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
    artist_id = '',
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
    <div className="text-xs">
      <h2 className="text-xl font-semibold capitalize">{first_name} {last_name}</h2>

      <div className="space-y-4 p-1 py-4 text-xs">
        <div className="space-y-2 p-1 py-4 text-xs">
          <div className="bg-[#3A3A3A] p-4 rounded-lg">
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-1 rounded border border-gray-600">
                <div className="bg-gray-600 text-[70%] text-center">{monthAbbr}</div>
                <div className="text-center text-[100%] pt-2 pb-2">{dayOfMonth}</div>
              </div>
              <div className="col-span-3 pl-4">
                {formattedLongDateWithDay}
                <br />
                <span className="text-[#808080] text-[90%]">{formattedStartTime} - {formattedEndTime}</span>
              </div>
              <div className="col-span-2 pr-1 flex items-center justify-end">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-[#344554] text-white"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-4">
              <div className="col-span-1 rounded border border-gray-600"></div>
              <div className="col-span-4 pl-4">
                {title}
                <br />
                <span className="text-[#808080] text-[90%]">{bookingDurationDisplay}</span>
              </div>
              <div className="col-span-1 pr-3 text-[90%]">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
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
            <span className="text-[color:#969696]">${price}</span>
          </div>
        </div>
        <div className="space-y-2 text-white grid grid-cols-2">
          <div className="col-span-1 text-left">
            <span className="text-[color:#969696]">Amount owed</span>
          </div>
          <div className="col-span-1 text-right">
            <span className="text-[color:#969696]">${price}</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Client Info */}
        <h2 className="text-sm">Client</h2>
        <div className="grid grid-cols-2">
          <div>
            <div className="col-span-1">Phone</div>
            <div className="col-span-1">{phone_number}</div>
          </div>
          <div>
            <div>Email</div>
            <div>{email_address}</div>
          </div>
        </div>

        <hr className="border-t border-[color:#3A3A3A]" />

        {/* Notes */}
        <h2 className="text-sm">Notes</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-[color:#969696]">{notes}</span>
          </div>
        </div>
        <hr className="border-t border-[color:#3A3A3A]" />

        <div>
          <button
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-xs"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
