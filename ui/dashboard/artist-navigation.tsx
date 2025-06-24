'use client';

import {
  UserGroupIcon,
  UserIcon,
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  EnvelopeIcon,
  TagIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Messages', href: '/dashboard/messages', icon:  EnvelopeIcon},
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Sales', href: '/dashboard/sales', icon: TagIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function navigation() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx('flex h-[48px] grow items-left gap-2 rounded-md p-3 text-xs text-white font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-4" />
            <p className="text-white w-4">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}