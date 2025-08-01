'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Members', href: '/dashboard/members', icon: HomeIcon },
  { name: 'General', href: '/dashboard/general', icon: UserGroupIcon },
  { name: 'Staff', href: '/dashboard/staff', icon: UserGroupIcon },
  { name: 'Services', href: '/dashboard/services', icon: UserGroupIcon },
  { name: 'Bookings', href: '/dashboard/bookings', icon: UserGroupIcon },
  { name: 'Payments', href: '/dashboard/payments', icon: UserGroupIcon },
  { name: 'Integrations', href: '/dashboard/integrations', icon: UserGroupIcon },
  { name: 'Appointments', href: '/dashboard/calendar-appointments', icon: UserGroupIcon },
  { name: 'Forms', href: '/dashboard/form-templates', icon: UserGroupIcon },
  { name: 'Subscriptions', href: '/dashboard/subscription-billing', icon: UserGroupIcon },
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
            className={clsx('flex h-[40px] grow items-left justify-left gap-2 rounded-md p-3 text-white text-xs hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-4" />
            <p className="text-white w-4 text-xs">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}