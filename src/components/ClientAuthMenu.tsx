'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, User, LogOut as LogOutIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export default function AuthMenu() {
  const [hasUser, setHasUser] = useState<boolean>(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setHasUser(!!data?.user);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setHasUser(!!session?.user);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/sign-in');
  };

  const IconButton = ({
    icon: Icon,
    label,
    href,
    onClick,
    count,
  }: {
    icon: IconComp;
    label: string;
    href?: string;
    onClick?: () => void;
    count?: number;
  }) => {
    const base =
      'w-10 h-8 rounded-md bg-[#313131] inline-flex items-center justify-center text-white hover:bg-gray-600 transition relative';
    const badge =
      typeof count === 'number' && count > 0 ? (count > 99 ? '99+' : String(count)) : '';

    return (
      <div className="relative group shrink-0">
        {href ? (
          <Link href={href} aria-label={label} title={label} className={base} prefetch={false}>
            <Icon className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <button type="button" onClick={onClick} aria-label={label} title={label} className={base}>
            <Icon className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {badge && (
          <span className="absolute -top-1.5 -right-1.5 grid place-items-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-[4px] shadow ring-1 ring-white z-40">
            {badge}
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

  // Render the icon row regardless; links work even before auth hydrates.
  return (
    <div className="flex items-center gap-3 flex-nowrap min-w-fit overflow-visible relative z-[100] pr-2">
      {/* <IconButton icon={MessageSquare} label="Messages" href="/lounge/messages" />
      <IconButton icon={Bell} label="Notifications" href="/lounge/notifications" /> */}
      {/* <IconButton icon={User} label="Profile" href="/lounge/profile" /> */}
      <IconButton icon={LogOutIcon} label="Sign out" onClick={handleSignOut} />
    </div>
  );
}
