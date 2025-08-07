'use client';

import clsx from 'clsx';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { ViewBookingForm } from '@/components/forms/bookings/ViewBookingForm';
import { z } from 'zod';
const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
});
interface BookingDrawerProps {
  initialData?: Booking;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  open: boolean;
  mode?: 'add' | 'edit' | 'view' | 'delete';
}

export function BookingDrawer({
  initialData,
  onClose,
  onSubmit,
  open,
  mode = 'add',
}: BookingDrawerProps) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';
  const isDelete = mode === 'delete';

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-all duration-700',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          'absolute inset-0 bg-black/50 transition-opacity duration-700',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Slide-in Drawer */}
      <div
        className={clsx(
          'absolute top-0 right-0 h-full w-full sm:w-[25vw] bg-[#313131] rounded-lg mt-2 shadow-lg transform transition-transform duration-700 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 overflow-y-auto h-full text-white">
          {/* Header */}
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-lg"
            >
              <XCircleIcon className="h-5 mr-2 text-[#969696]" />
            </button>
          </div>
          <div>
            {initialData?.id && (
              <ViewBookingForm
                bookingId={initialData.id}
                onClose={onClose}
                onRefresh={() => onSubmit?.(initialData)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
