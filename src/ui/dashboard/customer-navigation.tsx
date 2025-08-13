'use client';

import {
  UserIcon,
  HomeIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  CalendarIcon,
  
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Lounge', href: '/dashboard', icon: HomeIcon },
  { name: 'Bookings', href: '/dashboard/calendar', icon: CalendarIcon },
  { name: 'Messages', href: '/dashboard/messages', icon: EnvelopeIcon },
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
            className={clsx('flex h-[48px] grow items-center gap-2 rounded-md p-3 text-xs hover:bg-sky-100 hover:text-[#69AADE] md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'text-[#69AADE]': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-4" />
            <p className="md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}