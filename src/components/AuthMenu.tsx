'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, User, LogOut, Calendar } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AuthMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(7);
  const [appointmentsCount, setAppointmentsCount] = useState(2);

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

  // Icon button with optional link (href). Keeps badge + tooltip.
  const IconButton = ({
    icon: Icon,
    count,
    label,
    onClick,
    href,              // <— NEW: if provided, renders a Link instead of button
    target,
    rel,
  }: {
    icon: typeof Bell;
    count?: number;
    label: string;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
  }) => (
    <div className="relative group">
      {href ? (
        <Link
          href={href}
          target={target}
          rel={rel}
          aria-label={label}
          className="w-10 h-8 rounded-md bg-[#313131] inline-flex items-center justify-center text-white hover:bg-gray-600 transition relative"
        >
          <Icon className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={onClick}
          aria-label={label}
          className="w-10 h-8 rounded-md bg-[#313131] flex items-center justify-center text-white hover:bg-gray-600 transition relative"
        >
          <Icon className="w-4 h-4" />
        </button>
      )}

      {/* Count badge */}
      {count && count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}

      {/* Tooltip */}
      <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      {/* Messages and Notifications */}
      <IconButton icon={MessageSquare} count={messagesCount} label="Messages" />
      <IconButton icon={Bell} count={notificationsCount} label="Notifications" />

      {/* Profile → now links to /dashboard/profile */}
      <IconButton icon={User} label="Profile" href="/dashboard/profile" />

      {/* (Optional) Calendar example showing counts + link */}
      {/* <IconButton icon={Calendar} count={appointmentsCount} label="Calendar" href="/dashboard/calendar" /> */}

      {/* (Optional) Sign out as an action button */}
      {/* <IconButton icon={LogOut} label="Sign out" onClick={handleSignOut} /> */}
    </div>
  );
}
