import Link from 'next/link';
import NavLinks from '@/ui/dashboard/artist-navigation';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex grow flex-col space-y-2">
    <NavLinks />
    </div>
  );
}