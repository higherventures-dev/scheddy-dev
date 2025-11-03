'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, User, LogOut as LogOutIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type UserLite = { id: string; email?: string | null } | null;

export default function AuthMenu({ initialUser }: { initialUser?: UserLite }) {
  const [user, setUser] = useState<UserLite>(initialUser ?? null);
  const router = useRouter();
  const supabase = createClient();

  // DEBUG: see what's going on in the browser
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[AuthMenu] initialUser:', initialUser);
  }, [initialUser]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      // eslint-disable-next-line no-console
      console.debug('[AuthMenu] getUser()', { user: data?.user, error });
      if (mounted) {
        setUser(data?.user ? { id: data.user.id, email: data.user.email } : null);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // eslint-disable-next-line no-console
      console.debug('[AuthMenu] onAuthStateChange', _evt, !!session?.user);
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  // Reusable icon button
  const IconButton = ({
    icon: Icon,
    count,
    label,
    onClick,
    href,
    className = '',
    disabled,
  }: {
    icon: IconComp;
    count?: number;
    label: string;
    onClick?: () => void;
    href?: string;
    className?: string;
    disabled?: boolean;
  }) => {
    const hasBadge = typeof count === 'number' && count > 0;
    const badgeText = hasBadge ? (count! > 99 ? '99+' : String(count)) : '';

    const base =
      'w-10 h-8 rounded-md bg-[#313131] inline-flex items-center justify-center text-white transition relative';
    const hover = disabled ? 'opacity-50 cursor-default' : 'hover:bg-gray-600';

    return (
      <div className={`relative group shrink-0 ${className}`}>
        {href && !disabled ? (
          <Link href={href} aria-label={label} className={`${base} ${hover}`}>
            <Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={disabled ? undefined : onClick}
            aria-label={label}
            className={`${base} ${hover}`}
            disabled={disabled}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {hasBadge && (
          <span
            className="absolute -top-1.5 -right-1.5 grid place-items-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-600 rounded-[4px] shadow ring-1 ring-white z-40"
            aria-label={`${badgeText} ${label.toLowerCase()}`}
          >
            {badgeText}
          </span>
        )}

        <span
          className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition z-50"
          role="tooltip"
        >
          {label}
        </span>
      </div>
    );
  };

  // Keep a fixed width even if user isn't known yet (prevents layout shift)
  const containerClass =
    'flex items-center gap-3 flex-nowrap min-w-[176px] overflow-visible z-[60] relative pr-2';

  // If no user yet, show disabled placeholders (so you can SEE something is mounted)
  if (!user) {
    return (
      <div className={containerClass}>
        <IconButton icon={MessageSquare} label="Messages" disabled />
        <IconButton icon={Bell} label="Notifications" disabled />
        <IconButton icon={User} label="Profile" disabled />
        <IconButton icon={LogOutIcon} label="Sign out" disabled />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <IconButton icon={MessageSquare} label="Messages" />
      <IconButton icon={Bell} label="Notifications" />
      <IconButton icon={User} label="Profile" href="/dashboard/profile" />
      <IconButton icon={LogOutIcon} label="Sign out" onClick={handleSignOut} />
    </div>
  );
}
