'use client';

import clsx from 'clsx';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { ViewBookingForm } from '@/components/forms/bookings/ViewBookingForm';
import { Booking, BookingFormData } from '@/types/booking';

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
  onClose: (shouldRefresh?: boolean) => void;
  onSubmit?: (data: BookingFormData) => void;
  open: boolean;
  mode?: 'add' | 'edit' | 'view' | 'delete';
  onSaved?: (updated: BookingForSync) => void;
}

export function BookingDrawer({
  initialData,
  onClose,
  onSubmit,
  open,
  mode = 'view',
  onSaved,
}: BookingDrawerProps) {
  return (
    // Elevate the entire portal
    <div className="fixed inset-0 z-[110] flex pointer-events-none">
      {/* Overlay sits above header icons */}
      <div
        onClick={() => onClose(false)}
        aria-hidden="true"
        className={clsx(
          'absolute inset-0 bg-black/60 transition-opacity duration-300 z-[105]',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        )}
      />

      {/* Drawer above overlay */}
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'relative ml-auto w-full sm:w-[25vw] h-full bg-[#313131] rounded-l-lg shadow-xl',
          'transform transition-transform duration-300 ease-in-out pointer-events-auto z-[110]'
        , open ? 'translate-x-0' : 'translate-x-full')}
      >
        <div className="flex flex-col h-full p-4 overflow-y-auto text-white">
          {/* Header */}
          <div className="flex justify-end mb-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => onClose(false)}
              className="text-gray-300 hover:text-white text-lg inline-flex items-center"
            >
              <XCircleIcon className="h-5 w-5 mr-2 text-[#969696]" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Booking Form */}
          {initialData?.id && (
            <ViewBookingForm
              bookingId={initialData.id}
              onClose={onClose}
              onRefresh={() => onSubmit?.(initialData)}
              onSaved={onSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
