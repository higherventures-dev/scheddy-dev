'use client';

import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ServiceManager from '@/components/services/ServiceManager';
import CategoryManager from '@/components/services/CategoryManager';

import NewCategoryModal from '@/components/forms/services/NewCategoryModal';
import NewServiceModal from '@/components/forms/services/NewServiceModal';


export default function ServicesPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

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
          <div className="flex items-center justify-between mb-6"><h1 className="text-xl mb-6">Services & Categories</h1>
          
            {/* Add New Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="px-4 py-1 bg-[#3A3A3A] text-xs text-white">Add new</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowServiceModal(true)}>
                  Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCategoryModal(true)}>
                  Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          
        </div>
        
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

        
      {/* Modals */}
      <NewCategoryModal open={showCategoryModal} onOpenChange={setShowCategoryModal} />
      <NewServiceModal open={showServiceModal} onOpenChange={setShowServiceModal} />
      </div>
    </main>
  );
}
