import Link from 'next/link';
import NavLinks from '@/ui/dashboard/customer-navigation';
import Logo from '@/ui/scheddy-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex grow flex-col pl-6">
      <NavLinks />
    </div>
  );
}