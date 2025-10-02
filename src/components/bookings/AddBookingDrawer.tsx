// components/bookings/AddBookingDrawer.tsx
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

// Reuse your existing components/utilities
import DatePicker from '@/components/ui/DatePicker'
import ListTimePicker from '@/components/ui/ListTimePicker'
import { formatServicePrice } from '@/lib/utils/formatServicePrice'
import { createBooking } from '@/features/bookings/services/createBookingService'

type Service = {
  id: string
  name: string
  summary?: string
  duration?: number
  price?: number | null
  price2?: number | null
  hide_price_while_booking?: boolean
  price_type?: number | null
}

function convertMinutesToHours(minutes?: number): string {
  if (!minutes && minutes !== 0) return '45 mins'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs && mins) return `${hrs} hours | ${mins} mins`
  if (hrs) return `${hrs} hours`
  return `${mins} mins`
}

export default function AddBookingDrawer({
  artistProfile,
  services,
}: {
  artistProfile: { id: string; [k: string]: any }
  services: Service[]
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  // Step state
  const [step, setStep] = React.useState<1 | 2>(1)
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)

  // Form state
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [notes, setNotes] = React.useState('')

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [submitting, setSubmitting] = React.useState(false)

  function resetAll() {
    setStep(1)
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime('')
    setFirstName('')
    setLastName('')
    setPhoneNumber('')
    setEmailAddress('')
    setNotes('')
    setErrors({})
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) resetAll()
  }

  function pickService(svc: Service) {
    setSelectedService(svc)
    setStep(2)
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!selectedService) e.selectedService = 'Please select a service.'
    if (!selectedDate) e.selectedDate = 'Please select a date.'
    if (!selectedTime) e.selectedTime = 'Please select a time.'
    if (!firstName.trim()) e.firstName = 'First name is required.'
    if (!lastName.trim()) e.lastName = 'Last name is required.'
    if (!phoneNumber.trim()) {
      e.phoneNumber = 'Phone number is required.'
    } else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ''))) {
      e.phoneNumber = 'Enter a valid phone number with 10–15 digits.'
    }
    if (!emailAddress.trim()) {
      e.emailAddress = 'Email is required.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailAddress.trim())) {
      e.emailAddress = 'Enter a valid email address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !selectedService || !selectedDate) return

    try {
      setSubmitting(true)
      const DEFAULT_DURATION_MINUTES = selectedService.duration || 60
      const start = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`)
      const end = new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000)

      const bookingData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: emailAddress,
        notes,
        service_id: selectedService.id,
        title: selectedService.name,
        price: selectedService.price,
        price2: selectedService.price2,
        status: 1,
        artist_id: artistProfile.id,
        user_id: artistProfile.id, // adjust if different from artist_id
        selected_date: selectedDate.toISOString(),
        selected_time: selectedTime,
        start_time: start,
        end_time: end,
        allow_online_bookings: true, // if you need to echo profile flags, pass them via props
        hide_price_while_booking: selectedService.hide_price_while_booking,
        price_type: selectedService.price_type,
      }

      await createBooking(bookingData)
      onOpenChange(false) // close + reset
      router.refresh()    // refresh grid
    } catch (err) {
      console.error(err)
      setErrors((prev) => ({ ...prev, submit: 'There was an issue creating the booking.' }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="text-xs px-4 py-2 bg-[#313131] text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          + Add Booking
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{step === 1 ? 'Select a Service' : 'New Booking'}</SheetTitle>
          <SheetDescription>
            {step === 1
              ? 'Choose a service to start the booking.'
              : 'Review the service and enter client details to confirm.'}
          </SheetDescription>
        </SheetHeader>

        {/* STEP INDICATOR */}
        <div className="mt-4 mb-6 flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-white text-black' : 'bg-muted'}`}>1. Service</span>
          <span>›</span>
          <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-white text-black' : 'bg-muted'}`}>2. Details</span>
        </div>

        {/* STEP 1: SERVICES LIST */}
        {step === 1 && (
          <div className="space-y-3">
            {(services || []).length === 0 && (
              <div className="text-xs text-gray-400">No services found for this artist.</div>
            )}
            <ul className="divide-y divide-[#3a3a3a]">
              {(services || []).map((service) => {
                const priceLabel = !service?.hide_price_while_booking ? formatServicePrice(service) : null
                return (
                  <li key={service.id} className="py-3">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div>
                        <div className="text-sm font-medium">{service.name}</div>
                        {service.summary && (
                          <div className="text-xs text-gray-400">{service.summary}</div>
                        )}
                        <div className="text-[11px] text-gray-500 mt-1">
                          {priceLabel && <span>{priceLabel} – </span>}
                          {convertMinutesToHours(service.duration)}
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          className="text-xs"
                          onClick={() => pickService(service)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
            {errors.selectedService && (
              <p className="text-red-600 text-xs mt-1">{errors.selectedService}</p>
            )}
          </div>
        )}

        {/* STEP 2: BOOKING FORM */}
        {step === 2 && selectedService && (
          <form className="mt-2 space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Service summary */}
            <div className="rounded-md border border-[#3a3a3a] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{selectedService.name}</div>
                  {!!selectedService.summary && (
                    <div className="text-xs text-gray-400">{selectedService.summary}</div>
                  )}
                  <div className="text-[11px] text-gray-500 mt-1">
                    {!selectedService.hide_price_while_booking && formatServicePrice(selectedService)} ·{' '}
                    {convertMinutesToHours(selectedService.duration)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => setStep(1)}
                >
                  Change
                </Button>
              </div>
            </div>

            {/* Date / Time */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="mt-1">
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
                {errors.selectedDate && <p className="text-red-600 text-xs mt-1">{errors.selectedDate}</p>}
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <div className="mt-1">
                  <ListTimePicker value={selectedTime} onChange={setSelectedTime} />
                </div>
                {errors.selectedTime && <p className="text-red-600 text-xs mt-1">{errors.selectedTime}</p>}
              </div>
            </div>

            {/* Client details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label>Last name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label>Phone number</Label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
              {errors.emailAddress && <p className="text-red-600 text-xs mt-1">{errors.emailAddress}</p>}
            </div>

            <div>
              <Label>Notes</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                           shadow-sm ring-offset-background placeholder:text-muted-foreground
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                           disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {errors.submit && <p className="text-red-600 text-xs">{errors.submit}</p>}

            <div className="flex justify-between pt-1">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={submitting}>
                Back
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
