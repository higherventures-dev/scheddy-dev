'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Use a known-good set of icons
import { Bell, MessageSquare, User, LogOut as LogOutIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AuthMenu() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const [notificationsCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  if (!user) return null;

  type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

  const IconButton = ({
    icon: Icon,
    count,
    label,
    onClick,
    href,
    target,
    rel,
    className = '',
  }: {
    icon: IconComp;
    count?: number;
    label: string;
    onClick?: () => void;
    href?: string;
    target?: string;
    rel?: string;
    className?: string;
  }) => {
    const hasBadge = typeof count === 'number' && count > 0;
    const badgeText = hasBadge ? (count! > 99 ? '99+' : String(count)) : '';

    return (
      <div className={`relative group shrink-0 ${className}`}>
        {href ? (
          <Link
            href={href}
            target={target}
            rel={rel}
            aria-label={label}
            className="w-10 h-8 rounded-md bg-[#313131] inline-flex items-center justify-center text-white hover:bg-gray-600 transition relative"
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="w-10 h-8 rounded-md bg-[#313131] flex items-center justify-center text-white hover:bg-gray-600 transition relative"
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {hasBadge && (
          <span
            className="
              absolute -top-1.5 -right-1.5
              grid place-items-center
              w-4 h-4
              text-[10px] font-bold leading-none text-white
              bg-red-600 rounded-[4px]
              shadow ring-1 ring-white z-40
            "
            aria-label={`${badgeText} ${label.toLowerCase()}`}
          >
            {badgeText}
          </span>
        )}

        {/* Tooltip below */}
        <span
          className="
            pointer-events-none
            absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2
            px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition
            z-50
          "
          role="tooltip"
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 flex-nowrap min-w-fit overflow-visible z-[60] relative pr-2">
      <IconButton icon={MessageSquare} count={messagesCount} label="Messages" />
      <IconButton icon={Bell} count={notificationsCount} label="Notifications" />
      <IconButton icon={User} label="Profile" href="/dashboard/profile" />
      <IconButton icon={LogOutIcon as IconComp} label="Sign out" onClick={handleSignOut} />
    </div>
  );
}
