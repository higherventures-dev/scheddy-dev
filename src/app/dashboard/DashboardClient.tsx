"use client";

import { useState, useEffect } from "react";
import ArtistsBookingsGrid from "@/components/bookings/ArtistsBookingsGrid";

interface Booking {
  amount?: number;
  client_id?: string;
}

export default function DashboardClient({
  artistName,
  bookings,
}: {
  artistName: string;
  bookings: Booking[];
}) {
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    totalClients: 0,
    revenue: 0,
  });

  useEffect(() => {
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );
    const uniqueClients = new Set(bookings.map((b) => b.client_id)).size;

    setStats({
      upcomingBookings: bookings.length,
      totalClients: uniqueClients,
      revenue: totalRevenue,
    });
  }, [bookings]);

  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-6 p-4">
        <h1 className="text-5xl font-bold text-sky-400/60">
          ${stats.revenue.toLocaleString()}{" "}
          <span className="text-lg align-top ml-1">USD</span>
        </h1>
        <span className="text-xs text-sky-400/60">Available balance</span>
      </header>

       <div className="p-4">
          <h2 className="font-semibold mb-4">{currentMonth} {currentYear} Performance</h2>
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="New Clients" value={stats.totalClients} />
        <StatCard title="Bookings" value={stats.upcomingBookings} />
        <StatCard
          title="Average Booking Value"
          value={
            stats.totalClients
              ? `$${(stats.revenue / stats.totalClients).toFixed(2)}`
              : "$0"
          }
        />
        <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
      </section>
              </div>
      {/* Two Column Layout */}
      <div className="grid grid-cols-1">
       

        {/* Upcoming Bookings */}
        <div className="rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Upcoming Bookings</h2>
          <ArtistsBookingsGrid bookings={bookings} />
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-transparent rounded-xl shadow p-6 border-[#808080] border">
      <p className="text-sm text-[#808080]">{title}</p>
      <p className="text-2xl font-bold text-gray-300">{value}</p>
    </div>
  );
}
