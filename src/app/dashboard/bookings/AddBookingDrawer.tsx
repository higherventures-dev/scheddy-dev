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

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Booking</SheetTitle>
          <SheetDescription>Fill out the details and save to create a booking.</SheetDescription>
        </SheetHeader>

        {/* You can wire this form up later; for now it just displays */}
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
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
        </form>
      </SheetContent>
    </Sheet>
  )
}
