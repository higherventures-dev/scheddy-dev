'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Dashboard() {
  const supabase = createClient();
  const [artistName, setArtistName] = useState('Artist');
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    totalClients: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Example: Fetch artist name + stats
    const fetchData = async () => {
      const { data: user } = await supabase.auth.getUser();
      setArtistName(user?.user?.user_metadata?.name || 'Artist');

      // Example static data — replace with real queries
      setStats({
        upcomingBookings: 5,
        totalClients: 42,
        revenue: 1250,
      });
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {artistName} 👋
        </h1>
        <p className="text-gray-500">Here’s your current overview</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Upcoming Bookings" value={stats.upcomingBookings} />
        <StatCard title="Total Clients" value={stats.totalClients} />
        <StatCard
          title="Revenue (This Month)"
          value={`$${stats.revenue.toLocaleString()}`}
        />
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Calendar */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Calendar</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            📅 Calendar component goes here
          </div>
        </div>

        {/* Right: Recent Bookings */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <ul className="divide-y divide-gray-200">
            {[
              { client: 'Jane Doe', date: 'Aug 15, 2025', service: 'Haircut' },
              { client: 'Mike Ross', date: 'Aug 16, 2025', service: 'Coloring' },
            ].map((b, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{b.client}</p>
                  <p className="text-sm text-gray-500">{b.service}</p>
                </div>
                <span className="text-sm text-gray-400">{b.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
