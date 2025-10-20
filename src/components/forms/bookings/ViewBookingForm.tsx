'use client';

import { useEffect, useState } from 'react';
import { getBookingById } from '@/features/bookings/services/getBookingById';
import { updateBookingStatus } from '@/features/bookings/services/updateBookingStatus';
import BookingStatusSelect from '@/components/ui/BookingStatusSelect';
import { STATUS_OPTIONS, type StatusOption } from '@/lib/constants/statusOptions';
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber';

interface ViewBookingFormProps {
  bookingId: string;
  onClose: (shouldRefresh?: boolean) => void; // parent decides whether to refresh
  onRefresh: () => void;
  onSaved?: (updated: {
    id: string;
    user_id: string;
    status: number;
    start_time: string | Date;
    end_time: string | Date;
    title: string;
    description?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email_address?: string;
    price?: number;
  }) => void; // <-- added
}

export function ViewBookingForm({ bookingId, onClose, onRefresh, onSaved }: ViewBookingFormProps) {
  const [booking, setBooking] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(STATUS_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch latest booking on drawer open
  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await getBookingById(bookingId);
      if (data) {
        setBooking(data);
        const matchingStatus = STATUS_OPTIONS.find(opt => opt.value === data.status) ?? null;
        setSelectedStatus(matchingStatus);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSave = async () => {
    if (!selectedStatus) return setMessage('Please select a status');
    setLoading(true);
    setMessage('');

    try {
      // Update status in DB
      const res: any = await updateBookingStatus(bookingId, selectedStatus.value);
      if (res?.error) throw new Error(res.error.message);

      // Prefer updated row from service, else stitch from local state
      const updatedRow =
        res?.data ??
        {
          ...booking,
          status: selectedStatus.value,
        };

      // Keep local state consistent for any inline UI
      setBooking(updatedRow);

      // 🔔 Notify parent so it can sync to Google + refresh calendar
      onSaved?.({
        id: updatedRow.id,
        user_id: updatedRow.user_id,
        status: updatedRow.status,
        start_time: updatedRow.start_time,
        end_time: updatedRow.end_time,
        title: updatedRow.title,
        description: updatedRow.notes || '',
        first_name: updatedRow.first_name,
        last_name: updatedRow.last_name,
        phone_number: updatedRow.phone_number,
        email_address: updatedRow.email_address,
        price: updatedRow.price,
      });

      // Close drawer. We pass false to avoid double-refresh since onSaved will refresh.
      onClose(false);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update booking.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <div className="p-4 text-xs">Loading booking...</div>;

  const { first_name, last_name, phone_number, email_address, title, start_time, end_time, price, notes } = booking;
  const startDate = new Date(start_time);
  const endDate = new Date(end_time);
  const bookingDurationDisplay = getDurationDisplay(startDate, endDate);

  return (
    <div>
      <div className="grid grid-cols-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold capitalize">{first_name} {last_name}</h2>
        </div>
        <div className="flex justify-end">
          <BookingStatusSelect value={selectedStatus} onChange={setSelectedStatus} />
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Booking Details */}
        <div className="grid grid-cols-7 gap-1">
          <div className="col-span-1 rounded border border-gray-600">
            <div className="bg-gray-600 text-[70%] text-center">{startDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
            <div className="text-center pt-2 pb-2">{startDate.getDate()}</div>
          </div>
          <div className="col-span-6 pl-4">
            {title}
            <br />
            <span className="text-[#808080] text-[90%]">
              {startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              {' • '}{bookingDurationDisplay}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <h2 className="text-sm font-semibold">Payment</h2>
        <div className="grid grid-cols-2 gap-4 text-[100%] text-white">
          <div>Total price</div>
          <div className="text-right">${price}</div>
          <div>Amount owed</div>
          <div className="text-right">${price}</div>
        </div>

        {/* Client Info */}
        <h2 className="text-sm font-semibold">Client</h2>
        <div className="grid grid-cols-2 gap-4 text-[90%]">
          <div className="flex items-center text-[#969696]"><PhoneIcon className="h-4 mr-2" />Phone</div>
          <div className="text-right">{formatPhoneNumber(phone_number)}</div>
          <div className="flex items-center text-[#969696]"><EnvelopeIcon className="h-4 mr-2" />Email</div>
          <div className="text-right">{email_address}</div>
        </div>

        {/* Notes */}
        <h2 className="text-sm font-semibold">Notes</h2>
        <div className="text-[#969696]">{notes}</div>

        {message && <div className="text-red-400">{message}</div>}

        <div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 text-white text-xs rounded hover:bg-[#E5C26A] mr-4"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-300 text-black text-xs rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
