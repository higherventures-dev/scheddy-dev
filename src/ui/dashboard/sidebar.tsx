import Link from 'next/link';
import NavLinks from '@/ui/dashboard/navigation';
import Logo from '@/ui/scheddy-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideBar() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
    </div>
    </div>
  );
}