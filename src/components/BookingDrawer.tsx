'use client';

import clsx from 'clsx';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { ViewBookingForm } from '@/components/forms/bookings/ViewBookingForm';
import { Booking, BookingFormData } from '@/types/booking'; // Adjust types

// Minimal shape the parent calendar expects back for Google sync
type BookingForSync = {
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
};

interface BookingDrawerProps {
  initialData?: Booking;
  onClose: (shouldRefresh?: boolean) => void; // supports refresh flag
  onSubmit?: (data: BookingFormData) => void;
  open: boolean;
  mode?: 'add' | 'edit' | 'view' | 'delete';
  onSaved?: (updated: BookingForSync) => void; // <-- ADDED
}

export function BookingDrawer({
  initialData,
  onClose,
  onSubmit,
  open,
  mode = 'view',
  onSaved, // <-- ADDED
}: BookingDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {/* Overlay */}
      <div
        onClick={() => onClose(false)}
        className={clsx(
          'absolute inset-0 bg-black transition-opacity duration-300',
          open ? 'opacity-50 pointer-events-auto' : 'opacity-0'
        )}
      />

      {/* Drawer */}
      <div
        className={clsx(
          'relative ml-auto w-full sm:w-[25vw] h-full bg-[#313131] rounded-l-lg shadow-xl transform transition-transform duration-300 ease-in-out pointer-events-auto',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto text-white">
          {/* Header */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => onClose(false)}
              className="text-gray-300 hover:text-white text-lg"
            >
              <XCircleIcon className="h-5 mr-2 text-[#969696]" />
            </button>
          </div>

          {/* Booking Form */}
          {initialData?.id && (
            <ViewBookingForm
              bookingId={initialData.id}
              onClose={onClose} // receives shouldRefresh flag
              onRefresh={() => onSubmit?.(initialData)}
              onSaved={onSaved} // <-- PASSED THROUGH
            />
          )}
        </div>
      </div>
    </div>
  );
}
