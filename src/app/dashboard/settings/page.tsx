import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsToggle } from "@/components/SettingsToggle";
export default async function DashboardPage() {
    return (
        <div className="p-4">
            <h1 className="text-xl">Settings</h1>
        </div>
    );
}