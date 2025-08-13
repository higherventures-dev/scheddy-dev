'use client';

import {
  UserGroupIcon,
  UsersIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  UserIcon,
  Cog6ToothIcon,
  CalendarIcon,
  EnvelopeIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Artists', href: '/dashboard/artists', icon: UsersIcon },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Sales', href: '/dashboard/sales', icon: TagIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
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
            className={clsx('flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-transparent hover:text-[#69AADE] md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'text-[#69AADE]': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-4" />
            <p className="hidden md:block w-4">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}