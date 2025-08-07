'use client';
import { Client } from '../ClientsTable';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

const tabs = ['General', 'Bookings', 'Reviews','Photos','Notes'];

export function DeleteClientForm({ initialData, onClose }: { initialData: Client; onClose: () => void }) {
  return (
    <div>
        <div className=" bg-[#3A3A3A] p-3 rounded mb-4">
            <span className="p-1 text-[#808080] text-xs">You are preparing to delete all information within Scheddy for your client <strong className="text-white">{initialData.first_name} {initialData.last_name}</strong>.
                Are you sure that you want to do this?
            </span>
        </div>
        <div>
        <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-xs">
                Close
            </button>
        </div>
    </div>
    );
}