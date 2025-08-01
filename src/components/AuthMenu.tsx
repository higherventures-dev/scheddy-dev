'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, MessageSquare, User } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { createClient } from '@/utils/supabase/client';

export default function AuthMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 text-gray-600">
      <button>
        <MessageSquare className="w-5 h-5" />
      </button>
      <button>
        <Bell className="w-5 h-5" />
      </button>

      <Menu as="div" className="relative">
        <Menu.Button className="focus:outline-none">
          <User className="w-6 h-6" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-[#1c1c1c] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {/* <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/lounge/profile')}
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } w-full text-left px-4 py-2 text-xs text-white`}
                >
                  Edit Profile
                </button>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } w-full text-left px-4 py-2 text-xs text-white`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
