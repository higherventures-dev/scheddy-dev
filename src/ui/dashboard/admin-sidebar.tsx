import Link from 'next/link';
import NavLinks from '@/ui/dashboard/admin-navigation';
import Logo from '@/ui/scheddy-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOutAction } from "@/app/actions";

export default function SideNav() {
  return (
    <div className="flex grow flex-col space-y-2">
        <NavLinks />
        </div>
  );
}