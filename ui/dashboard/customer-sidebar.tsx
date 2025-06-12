import Link from 'next/link';
import NavLinks from '@/ui/dashboard/customer-navigation';
import Logo from '@/ui/scheddy-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex grow flex-col space-y-2">
        <NavLinks />
        <form>
          <button className="flex h-[48px] w-full grow items-left justify-left gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="text-white">Sign Out</div>
          </button>
        </form>
        </div>
  );
}