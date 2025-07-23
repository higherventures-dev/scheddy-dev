'use client';

import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsToggle } from "@/components/SettingsToggle";
import { TimeSelect } from "@/components/TimeSelect";

export default async function SettingsCalendarPage() {
    return (
        <div>
            <h1 className="p-4 text-xl">Calendar</h1>
            <div className="p-4 text-gray-400 text-xs">Display preferences</div>
            <div className="grid grid-cols-4 text-xs w-[50vw] p-2">
            <div className="col-span-4 border border-[#313131] rounded-lg px-4 py-3 mb-4">
                <div className="mb-4">
                <div className="text-white font-medium">Visible hours</div>
                <div className="text-xs text-gray-400 mt-1">
                    Select the hours you want to display on your calendar.
                </div>
                </div>
                <div className="grid grid-cols-4 w-[55%]">
                <div className="col-span-2">
                    <div className="py-2">From</div>
                    <TimeSelect />
                </div>
                <div className="col-span-2">
                    <div className="py-2">Until</div>
                    <TimeSelect />
                </div>
                </div>
            </div>
                <div className="col-span-4 mb-4">
                    <div className="border border-[#313131] rounded-lg px-4 py-3">
                        <div className="text-white font-medium">Reminders</div>
                        <div className="text-xs text-gray-400 mt-1 mb-2">Send automated text and email reminders to clients 24 hours before their scheduled appointments, ensuring they’re well-prepared.</div>
                        <SettingsToggle
                            label="Text Reminders"
                            description=""
                            value={true}
                            onChange={(val) => {/* update Supabase or form state */}}
                            bordered={false}
                            />
                            <div className="border border-[#313131] ml-4 mr-2"></div>
                            <SettingsToggle
                            label="Email Reminders"
                            description=""
                            value={true}
                            onChange={(val) => {/* update Supabase or form state */}}
                            bordered={false}
                            />
                    </div>
                </div>
                <div className="col-span-4 mb-4">
                      <div className="py-4 text-gray-400">Cancellations</div>
                          <div className="border border-[#313131] rounded-lg py-3 pr-4">
           
                    <SettingsToggle
                        label="Show cancellation policy"
                        description="Select if you want to show cancellation policy to your clients. Enter the text that you would like to be included as your cancellation policy in various emails, and online booking."
                        value={true}
                        onChange={(val) => {/* update Supabase or form state */}}
                        bordered={false}
                        />
                        <div className="border border-[#313131] m-4"></div>
                             <div className="px-4 py-2">Cancellation policy for emails and online booking<br></br>
                    <textarea className="rounded p-3 w-[100%] mt-2" placeholder="For appointments canceled or rescheduled within 24 hours we charge 50% of the service total."/>
                    </div></div>
                </div>
            </div>
        </div>
    );
}