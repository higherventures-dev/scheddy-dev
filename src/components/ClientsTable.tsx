// =============================
// components/ClientsTable.tsx
// =============================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatPhoneNumber } from "@/lib/utils/formatPhoneNumber";
import { createPortal } from 'react-dom';

export type Client = {
  id: string;
  avatar_url?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email_address?: string;
  created_at?: string;
  phone_number_2?: string;
  email_appointment_notification?: boolean;
  text_appointment_notification?: boolean;
  email_marketing_notification?: boolean;
  text_marketing_notification?: boolean;
  occupation?: string;
  referral_source?: number;
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
  // Track which dropdown is open (by client id)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  // Dropdown position for portal menu
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

  // Refs for buttons to calculate dropdown position
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdownId) {
        const btn = buttonRefs.current[openDropdownId];
        if (btn && !btn.contains(event.target as Node)) {
          // Also check if click was inside the dropdown menu
          const dropdownMenu = document.getElementById('clients-dropdown-menu');
          if (dropdownMenu && dropdownMenu.contains(event.target as Node)) {
            // Click inside dropdown, do nothing
            return;
          }
          setOpenDropdownId(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  // Toggle dropdown open/close and set position
  const toggleDropdown = useCallback((clientId: string) => {
    if (openDropdownId === clientId) {
      setOpenDropdownId(null);
      setDropdownPos(null);
      return;
    }

    const btn = buttonRefs.current[clientId];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    // Position the dropdown below and aligned right to button
    setDropdownPos({
      top: rect.bottom + window.scrollY + 4,  // 4px spacing below button
      left: rect.right + window.scrollX - 128, // 128px dropdown width aligned right
    });

    setOpenDropdownId(clientId);
  }, [openDropdownId]);

  // DropdownMenu rendered in a portal, positioned absolutely on the page
  const DropdownMenu = () => {
    if (!openDropdownId || !dropdownPos) return null;
    const client = clients.find(c => c.id === openDropdownId);
    if (!client) return null;

    return createPortal(
      <ul
        id="clients-dropdown-menu"
        style={{
          position: 'absolute',
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: 128,
          backgroundColor: '#313131',
          border: '1px solid #4b5563', // gray-700
          borderRadius: 6,
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          zIndex: 1000,
          padding: 0,
          margin: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'none',
          overflow: 'visible',
          userSelect: 'none',
        }}
      >
        {onView && (
          <li
            className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-xs text-white whitespace-nowrap"
            onClick={() => {
              onView(client);
              setOpenDropdownId(null);
            }}
          >
            View
          </li>
        )}
        {onEdit && (
          <li
            className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-xs text-white whitespace-nowrap"
            onClick={() => {
              onEdit(client);
              setOpenDropdownId(null);
            }}
          >
            Edit
          </li>
        )}
        {onDelete && (
          <li
            className="px-3 py-2 cursor-pointer hover:bg-red-700 text-xs text-red-400 whitespace-nowrap"
            onClick={() => {
              onDelete(client);
              setOpenDropdownId(null);
            }}
          >
            Delete
          </li>
        )}
      </ul>,
      document.body
    );
  };

  return (
    <div className="overflow-x-auto py-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-xs font-semibold text-[#808080]">
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
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getRandomColor(
                    client.first_name
                  )}`}
                >
                  {client.first_name?.charAt(0).toUpperCase()}
                </div>
              </td>
              <td className="px-4 py-2 text-white font-medium">{client.first_name}</td>
              <td className="px-4 py-2 text-white font-medium">{client.last_name}</td>
              <td className="px-4 py-2 text-white">{formatPhoneNumber(client.phone_number) || '-'}</td>
              <td className="px-4 py-2 text-white">{client.email_address || '-'}</td>
              <td className="px-4 py-2 text-right relative">
                <button
                  aria-label="Actions menu"
                  className="p-1 rounded hover:bg-gray-700 text-white"
                  onClick={() => toggleDropdown(client.id)}
                  ref={el => (buttonRefs.current[client.id] = el)}
                >
                  {/* 3 horizontal dots icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="4" cy="10" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DropdownMenu />
    </div>
  );
}
