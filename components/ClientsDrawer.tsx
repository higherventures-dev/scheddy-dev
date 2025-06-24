'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from './ClientsTable';
import clsx from 'clsx';
import { Tab } from '@headlessui/react';
const clientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientsDrawerProps {
  initialData?: Client;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  open: boolean;
}

export function ClientsDrawer({ initialData, onClose, onSubmit, open, mode='add' }: ClientsDrawerProps) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';

  const tabs = ['General', 'Bookings', 'Reviews','Photos','Notes'];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
    },
  });

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {initialData ? 'Edit Client' : 'Add Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>
          <div>
            <Tab.Group>
        <Tab.List className="flex space-x-2 px-4 pt-2">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                clsx(
                  'px-3 py-1 text-sm rounded-md',
                  selected ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="p-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          <Tab.Panel>
            {/* Tab 1: Details Form */}
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First name:</label>
              <input
                {...register('first_name')}
                className="w-full border px-3 py-2 rounded-md text-white text-xs"
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name:</label>
              <input
                {...register('last_name')}
                className="w-full border px-3 py-2 rounded-md text-white text-xs"
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full border px-3 py-2 rounded-md text-white text-xs"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register('phone')}
                className="w-full border px-3 py-2 rounded-md text-white text-xs"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {initialData ? 'Update Client' : 'Save Client'}
              </button>
            </div>
          </form>
          </Tab.Panel>

          <Tab.Panel>
            {/* Tab 2: Notes */}
            <textarea
              name="notes"
              placeholder="Internal notes..."
              className="w-full border p-2 rounded-md text-sm h-32"
              defaultValue={initialData?.notes}
            />
          </Tab.Panel>

          <Tab.Panel>
            {/* Tab 3: Activity or future history */}
            <p className="text-sm text-gray-500">No activity yet.</p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
          </div>
         
        </div>
      </div>
    </div>
  );
}