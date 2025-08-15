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
import { useState } from 'react';

const links = [
  { name: 'Overview', href: '/dashboard/', icon: HomeIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Services', href: '/dashboard/services', icon: UserGroupIcon },
  { name: 'Sales', href: '/dashboard/sales', icon: TagIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  // ✅ Settings with sub-links
  {
    name: 'Settings',
    icon: Cog6ToothIcon,
    subLinks: [
      { name: 'Bookings', href: '/dashboard/settings/bookings' },
      {
        name: 'Calendar',
        href: '/dashboard/settings/calendar',
      },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();

  // ✅ Auto-open Settings if current route is a sub-link
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const currentParent = links.find((link) =>
      link.subLinks?.some((sub) => pathname.startsWith(sub.href))
    );
    return currentParent ? currentParent.name : null;
  });

  // ✅ Profile goes to bottom
  const bottomLink = links.find((link) => link.name === 'Profile');
  const topLinks = links.filter((link) => link.name !== 'Profile');

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top menu items */}
      <div className="space-y-1">
        {topLinks.map((link) => {
          const isActive = pathname === link.href;
          const LinkIcon = link.icon;

          if (link.subLinks) {
            const isOpen = openMenu === link.name;
            return (
              <div key={link.name} className="flex flex-col">
                <button
                  onClick={() => setOpenMenu(isOpen ? null : link.name)}
                  className={clsx(
                    'flex items-center justify-between rounded-md p-3 text-xs font-medium transition-colors w-full',
                    {
                      'bg-white/10 text-[#69AADE]': isOpen,
                      'text-white hover:text-[#69AADE] hover:bg-white/10': !isOpen,
                    }
                  )}
                >
                  <div className="flex items-center gap-2">
                    {LinkIcon && <LinkIcon className="w-4" />}
                    <span>{link.name}</span>
                  </div>
                  <span>{isOpen ? '-' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {link.subLinks.map((sub) => {
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={clsx(
                            'block rounded-md px-3 py-2 text-xs transition-colors',
                            {
                              'bg-white/10 text-[#69AADE]': subActive,
                              'text-white hover:text-[#69AADE] hover:bg-white/10': !subActive,
                            }
                          )}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-2 rounded-md p-3 text-xs font-medium transition-colors',
                {
                  'bg-white/10 text-[#69AADE]': isActive,
                  'text-white hover:text-[#69AADE] hover:bg-white/10': !isActive,
                }
              )}
            >
              {LinkIcon && <LinkIcon className="w-4" />}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* ✅ Bottom pinned Profile */}
      {bottomLink && (
        <div className="mt-4">
          {(() => {
            const isActive = pathname === bottomLink.href;
            const LinkIcon = bottomLink.icon;
            return (
              <Link
                href={bottomLink.href}
                className={clsx(
                  'flex items-center gap-2 rounded-md p-3 text-xs font-medium transition-colors',
                  {
                    'bg-white/10 text-[#69AADE]': isActive,
                    'text-white hover:text-[#69AADE] hover:bg-white/10': !isActive,
                  }
                )}
              >
                {LinkIcon && <LinkIcon className="w-4" />}
                <span>{bottomLink.name}</span>
              </Link>
            );
          })()}
        </div>
      )}
    </div>
  );
}
