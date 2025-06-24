// =============================
// components/ClientsGrid.tsx
// =============================

import { Client } from './ClientsTable';

export function ClientsGrid({ clients, onEdit }: { clients: Client[]; onEdit: (client: Client) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{client.name}</h2>
          <p className="text-sm text-gray-600">{client.email || 'No email'}</p>
          <p className="text-sm text-gray-600">{client.phone || 'No phone'}</p>
          <p className="text-xs text-gray-400 mt-2">
            Created: {client.created_at ? new Date(client.created_at).toLocaleDateString() : '—'}
          </p>
          <div className="mt-3">
            <button
              onClick={() => onEdit(client)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
