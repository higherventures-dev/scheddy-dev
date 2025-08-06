'use client';

import clsx from 'clsx';
// import { BookingFormData } from './components/ClientsDrawer';
import { ViewBookingForm } from './forms/ViewBookingForm';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tab } from '@headlessui/react';
const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
});
interface BookingDrawerProps {
//   initialData?: Booking;
  onClose: () => void;
//   onSubmit: (data: BookingFormData) => void;
  open: boolean;
  mode?: 'add' | 'edit' | 'view' | 'delete';
}

export function BookingDrawer({
  initialData,
  onClose,
  open,
  mode = 'add',
}: BookingDrawerProps) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';
  const isDelete = mode === 'delete';

  console.log("DATA", initialData)
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
          'absolute top-0 right-0 h-full w-full sm:w-[480px] bg-[#313131] shadow-lg transform transition-transform duration-700 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6 overflow-y-auto h-full text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {/* <h2 className="text-xl font-semibold capitalize">
              {isView && 'View Booking'}
              {isEdit && 'Edit Booking'}
              {isAdd && 'Add Booking'}
              {isDelete && 'Delete Booking'}
            </h2> */}
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Conditional Form Rendering */}
          <div>
            {/* {isAdd && <AddClientForm onSubmit={onSubmit} />}
            {isEdit && initialData && (
              <EditClientForm initialData={initialData} onSubmit={onSubmit} />
            )}
            {isView && initialData && (
              <ViewClientForm initialData={initialData} onClose={onClose} />
            )}
            {isDelete && initialData && (
              <DeleteClientForm initialData={initialData} onSubmit={onSubmit} />
            )} */}
            {/* <ViewBookingForm initialData={initialData} onClose={onClose} /> */}
            {initialData?.id && (
                <ViewBookingForm bookingId={initialData.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}