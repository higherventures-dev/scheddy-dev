import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // if (!session) redirect("auth/sign-in");
    return <h1 className="text-xl p-4">Overview</h1>;
}