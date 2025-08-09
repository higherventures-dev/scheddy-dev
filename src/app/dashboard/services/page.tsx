'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ServiceManager from '@/components/services/ServiceManager';
import CategoryManager from '@/components/services/CategoryManager'; // assuming you have this

export default function ServicesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setUser(null);
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    fetchUser();
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div className="text-red-500">Not signed in</div>;
  }

  return (
    <main className="p-6 min-h-screen text-white">
      <div className="w-[50vw]">
                <h1 className="text-xl mb-6">Services & Categories</h1>
        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            className={`px-4 rounded-lg py-2 ${
              activeTab === 'services' ? 'bg-[#3A3A3A] text-white text-xs' : 'bg-transparent text-gray-400 text-xs'
            }`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button
            className={`px-4 rounded-lg py-2 ${
              activeTab === 'categories' ? 'bg-[#3A3A3A] text-white text-xs' : 'bg-transparent text-gray-400 text-xs'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'services' && <ServiceManager artistId={user.id} />}
        {activeTab === 'categories' && <CategoryManager userId={user.id} />}
      </div>
    </main>
  );
}
