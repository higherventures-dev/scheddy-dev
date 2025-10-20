'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// TEST: Import a “safe” icon that definitely exists, plus LogOut (which may vary by version)
import { Bell, MessageSquare, User, Power, LogOut as LogOutMaybe } from 'lucide-react';
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
      const { data, error } = await supabase.auth.getUser();
      // Quick debug: if user is missing, nothing renders at all.
      // console.log('AuthMenu user', { user: data?.user, error });
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
  }) => (
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

      {count && count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full z-40">
          {count}
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

  return (
    // Prevent wrapping; allow overflow so tooltips/log out aren't clipped
    <div className="flex items-center gap-3 flex-nowrap min-w-fit overflow-visible z-[60] relative pr-2">
      {/* Normal icons */}
      <IconButton icon={MessageSquare} count={messagesCount} label="Messages" />
      <IconButton icon={Bell} count={notificationsCount} label="Notifications" />
      <IconButton icon={User} label="Profile" href="/dashboard/profile" />

      {/* --- DIAGNOSTIC SIGN-OUT CONTROLS --- */}

      {/* (A) IconButton with a SAFE icon: Power */}
      <IconButton
        icon={Power}
        label="Sign out"
        onClick={handleSignOut}
        className="outline outline-1 outline-emerald-400/70 rounded-lg"
      />

      {/* (B) Plain text button (no icon at all) */}
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Sign out"
        className="shrink-0 h-8 px-2 rounded-md bg-[#313131] text-white hover:bg-gray-600 transition outline outline-1 outline-sky-400/70"
        title="Sign out (plain)"
      >
        Sign out
      </button>

      {/* (C) Your original intent using LogOut — may fail if icon name/version mismatch */}
      {LogOutMaybe ? (
        <IconButton icon={LogOutMaybe as IconComp} label="Sign out" onClick={handleSignOut} />
      ) : (
        // If your lucide version doesn’t export LogOut, we render a tiny badge so you can *see* that branch failed.
        <span className="text-[10px] px-2 py-1 rounded bg-red-600 text-white">LogOut icon missing</span>
      )}
    </div>
  );
}
