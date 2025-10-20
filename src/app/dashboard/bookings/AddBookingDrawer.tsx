// components/bookings/AddBookingDrawer.tsx
'use client'

import * as React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function AddBookingDrawer() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="text-xs px-4 py-2 bg-[#313131] text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          + Add Booking
        </Button>
      </SheetTrigger>

      {/* p-0 so we can control header/body/footer spacing */}
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        {/* Make the sheet content a flex column that fills the height */}
        <div className="flex h-full min-h-0 flex-col">
          {/* Sticky header so actions stay visible */}
          <SheetHeader className="p-6 sticky top-0 z-10 bg-[#323232] border-b border-gray-700">
            <SheetTitle>New Booking</SheetTitle>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" name="clientName" placeholder="Jane Doe" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input id="clientEmail" name="clientEmail" type="email" placeholder="jane@example.com" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Input id="service" name="service" placeholder="Tattoo — Half Sleeve" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="startAt">Start Date & Time</Label>
                <Input id="startAt" name="startAt" type="datetime-local" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={4} placeholder="Any special requests or references…" />
              </div>

              {/* Extra bottom padding so the last field isn't under the footer on small screens */}
              <div className="pb-24" />
            </form>
          </div>

          {/* Sticky footer (optional actions) */}
          <div className="sticky bottom-0 z-10 bg-[#323232] border-t border-gray-700 p-4 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="text-xs"
              onClick={() => {
                // TODO: submit handler
                setOpen(false)
              }}
            >
              Save Booking
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
