'use client';

import {
  UserGroupIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Overview', href: '/dashboard/', icon: HomeIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Services', href: '/dashboard/services', icon: UserGroupIcon },
  { name: 'Sales', href: '/dashboard/sales', icon: TagIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const topLinks = links.slice(0, -1); // All except last
  const bottomLink = links[links.length - 1]; // Last link

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top menu items */}
      <div className="space-y-1">
        {topLinks.map((link) => {
          const isActive = pathname === link.href;
          const LinkIcon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-2 rounded-md p-3 text-xs font-medium transition-colors',
                {
                  'bg-white/10 text-[#E5C26A]': isActive,
                  'text-white hover:text-[#E5C26A] hover:bg-white/10': !isActive,
                }
              )}
            >
              <LinkIcon className="w-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom pinned item */}
      <div>
        {(() => {
          const isActive = pathname === bottomLink.href;
          const LinkIcon = bottomLink.icon;
          return (
            <Link
              href={bottomLink.href}
              className={clsx(
                'flex items-center gap-2 rounded-md p-3 text-xs font-medium transition-colors',
                {
                  'bg-white/10 text-[#E5C26A]': isActive,
                  'text-white hover:text-[#E5C26A] hover:bg-white/10': !isActive,
                }
              )}
            >
              <LinkIcon className="w-4" />
              <span>{bottomLink.name}</span>
            </Link>
          );
        })()}
      </div>
    </div>
  );
}