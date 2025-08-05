// =============================
// components/BookingTable.tsx
// =============================

import React from 'react';
import Image from "next/image";

export type Booking = {
id: string;
first_name?: string;
last_name?: string;
phone_number?: string;
email_address?: string;
notes?: string;
service_id: number;
title: string;
price: number;
status: number;
studio_id: number;
artist_id: number;
client_id: number;
user_id: number;
selected_date?: string;
selected_time?: string;
start_time?: string;
end_time?: string;
};

type BookingTableProps = {
  booking: Booking[];
  onEdit?: (booking: Booking) => void;
  onView?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
};

export function BookingTable({
  booking,
  onEdit,
  onView,
  onDelete,
  }: BookingTableProps) {
  return (
    <div className="overflow-x-auto py-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left text-xs font-semibold text-[#808080]">
            <th className="px-4 py-2 border-b"></th>
            <th className="px-4 py-2 border-b"></th>
            <th className="px-4 py-2 border-b">First name</th>
            <th className="px-4 py-2 border-b">Last name</th>
            <th className="px-4 py-2 border-b">Phone</th>
            <th className="px-4 py-2 border-b">Email address</th>
            <th className="px-4 py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
            <tr className="text-xs border-b border-[#313131]">
               <td className="px-4 py-2">
              <input type="checkbox" />
            </td>
            <td className="px-4 py-2">
            </td>
              <td className="px-4 py-2 text-white font-medium">First Name</td>
              <td className="px-4 py-2 text-white font-medium">Last Name</td>
              <td className="px-4 py-2 text-white">Phone</td>
              <td className="px-4 py-2 text-white">Email</td>
              <td className="px-4 py-2 text-right space-x-2">
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}