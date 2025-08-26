'use client';

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsToggle } from "@/components/SettingsToggle";

export default async function BookingsPage() {
    return (
        <div>
            <h1 className="text-xl p-4">Bookings</h1>
            <div className="grid grid-cols-4 text-xs w-[50vw] p-4">
                <div className="col-span-4 mb-4">
                    <SettingsToggle
                        label="Allow clients to book appointments online"
                        description={
                            <>Shareable booking link: <span className="text-blue-200">https://booking.scheddy.us/mybrand </span>
                            </>
                        }
                        value={true}
                        onChange={(val) => {/* update Supabase or form state */}}
                        />
                </div>
                <div className="col-span-4 mb-4">
                    <SettingsToggle
                        label="Automatically confirm every booking"
                        description="When enabled, all new bookings will be automatically confirmed. To confirm bookings manually, simply leave this option disabled."
                        value={true}
                        onChange={(val) => {/* update Supabase or form state */}}
                        />
                </div>
            </div>
        </div>
    );
}