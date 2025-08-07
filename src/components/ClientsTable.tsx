// =============================
// components/ClientsTable.tsx
// =============================

import React from 'react';
import Image from "next/image";

export type Client = {
  id: string;
  avatar_url?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email_address?: string;
  created_at?: string;
};

// Returns a consistent pastel-ish color based on the input string
function getRandomColor(name: string) {
  const colors = [
    'bg-gray-800', 'bg-gray-700', 'bg-gray-600',
    'bg-gray-500', 'bg-gray-400', 'bg-gray-300',
    'bg-gray-200'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

type ClientsTableProps = {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onView?: (client: Client) => void;
  onDelete?: (client: Client) => void;
};

export function ClientsTable({
  clients,
  onEdit,
  onView,
  onDelete,
  }: ClientsTableProps) {
  return (
    <div className="overflow-x-auto py-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-xs font-semibold text-[#808080]">
            <th className="px-4 py-2 border-b"></th>
            <th className="px-4 py-2 border-b"></th>
            <th className="px-4 py-2 border-b">First name</th>
            <th className="px-4 py-2 border-b">Last name</th>
            <th className="px-4 py-2 border-b">Phone number</th>
            <th className="px-4 py-2 border-b">Email address</th>
            <th className="px-4 py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="text-xs border-b border-[#313131]">
               <td className="px-4 py-2">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(client.first_name)}`}>
    {client.first_name?.charAt(0).toUpperCase()}
  </div>
            </td>
              <td className="px-4 py-2 text-white font-medium">{client.first_name}</td>
              <td className="px-4 py-2 text-white font-medium">{client.last_name}</td>
              <td className="px-4 py-2 text-white">{client.phone_number || '-'}</td>
              <td className="px-4 py-2 text-white">{client.email_address || '-'}</td>
              <td className="px-4 py-2 text-right space-x-2">
                {onView && (
                  <button onClick={() => onView(client)} className="text-blue-400 hover:underline text-xs">
                    View
                  </button>
                )}
                {onEdit && (
                  <button onClick={() => onEdit(client)} className="text-yellow-400 hover:underline text-xs">
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(client)} className="text-red-400 hover:underline text-xs">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}