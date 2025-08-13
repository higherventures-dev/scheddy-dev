'use client';

import clsx from 'clsx';
import { Client } from './ClientsTable';
import { AddClientForm } from '@/components/forms/clients/AddClientForm';
import { EditClientForm } from '@/components/forms/clients/EditClientForm';
import { ViewClientForm } from '@/components/forms/clients/ViewClientForm';
import { DeleteClientForm } from '@/components/forms/clients/DeleteClientForm';
import { ClientFormData } from '@/components/forms/clients/AddClientForm';

interface ClientsDrawerProps {
  initialData?: Client;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  onDelete?: (client: Client) => Promise<void>;
  open: boolean;
  mode?: 'add' | 'edit' | 'view' | 'delete';
}

export function ClientsDrawer({
  initialData,
  onClose,
  onSubmit,
  onDelete,
  open,
  mode = 'add',
}: ClientsDrawerProps) {
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
          'absolute top-0 right-0 h-full w-full sm:w-[480px] bg-[#313131] shadow-lg transform transition-transform duration-700 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6 overflow-y-auto h-full text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">
              {isView && initialData && (initialData.first_name || initialData.last_name)
                ? `${initialData.first_name ?? ''} ${initialData.last_name ?? ''}`.trim()
                : null}
              {isEdit && initialData && (initialData.first_name || initialData.last_name)
                ? `${initialData.first_name ?? ''} ${initialData.last_name ?? ''}`.trim()
                : null}
              {isAdd && 'Add Client'}
              {isDelete && 'Delete Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Conditional Form Rendering */}
          <div>
            {isAdd && <AddClientForm onSubmit={onSubmit} />}
            {isEdit && initialData && (
              <EditClientForm initialData={initialData} onSubmit={onSubmit} />
            )}
            {isView && initialData && (
              <ViewClientForm initialData={initialData} onClose={onClose} />
            )}
            {isDelete && initialData && onDelete && (
              <DeleteClientForm
                initialData={initialData}
                onDelete={onDelete}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
