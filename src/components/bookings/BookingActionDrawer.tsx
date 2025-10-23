// components/bookings/BookingActionDrawer.tsx
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetOverlay, // 👈 ensure this is exported from your shadcn sheet
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import DatePicker from '@/components/ui/DatePicker'
import ListTimePicker from '@/components/ui/ListTimePicker'
import { formatServicePrice } from '@/lib/utils/formatServicePrice'
import { syncBookingToGoogle, type ScheddyStatus } from '@/features/google/syncBooking'

type ActionType = 'View' | 'Edit' | 'Cancel'

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

type BookingLite = {
  id: string | number
  title?: string | null
  service_id?: string | null
  status: number
  start_time: string | Date
  end_time: string | Date
  price?: number | null
  price2?: number | null
  notes?: string | null
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  email_address?: string | null
  artist?: { first_name?: string; last_name?: string } | null
}

// ---- helpers ----
function convertMinutesToHours(minutes?: number): string {
  if (minutes == null) return '45 mins'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs && mins) return `${hrs} hours | ${mins} mins`
  if (hrs) return `${hrs} hours`
  return `${mins} mins`
}

function buildLocalDateTime(date: Date, hhmm: string) {
  const [hh, mm] = (hhmm || '09:00').split(':').map(Number)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hh, mm, 0, 0)
}

function mapNumericStatusToScheddyStatus(n: number): ScheddyStatus {
  switch (n) {
    case 2: return 'Confirmed'
    case 3: return 'No-show'
    case 4: return 'Canceled'
    case 5: return 'Completed'
    default: return 'Unconfirmed'
  }
}

export default function BookingActionDrawer({
  open,
  onOpenChange,
  action,
  booking,
  services,
  artistProfile,
  cancelAction,
  canEdit,
  onSaveEdit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  action: ActionType
  booking?: BookingLite | null
  services: Service[]
  artistProfile: { id: string; google_calendar_id?: string }
  cancelAction: (formData: FormData) => Promise<void>
  canEdit: boolean
  onSaveEdit?: (id: string | number, payload: any) => Promise<void>
}) {
  const router = useRouter()

  const [serviceId, setServiceId] = React.useState<string>('')
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [err, setErr] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open || !booking) return
    setServiceId(booking.service_id ?? '')
    const start = new Date(booking.start_time)
    setSelectedDate(start)
    const hh = start.getHours().toString().padStart(2, '0')
    const mm = start.getMinutes().toString().padStart(2, '0')
    setSelectedTime(`${hh}:${mm}`)
    setFirstName(booking.first_name ?? '')
    setLastName(booking.last_name ?? '')
    setPhoneNumber(booking.phone_number ?? '')
    setEmailAddress(booking.email_address ?? '')
    setNotes(booking.notes ?? '')
    setErr('')
    setSaving(false)
  }, [open, booking])

  const readOnly = action === 'View' || (action === 'Edit' && !canEdit)
  const selectedService =
    services.find(s => s.id === (serviceId || booking?.service_id || '')) || null

  const missingBooking =
    open && !booking && (action === 'View' || action === 'Edit' || action === 'Cancel')

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    if (!canEdit || !booking) return

    try {
      setSaving(true)
      const svc = services.find(s => s.id === serviceId) || null

      const start = selectedDate
        ? buildLocalDateTime(selectedDate, selectedTime || '09:00')
        : new Date(booking.start_time)

      const durationMin = svc?.duration ?? 60
      const end = new Date(start.getTime() + durationMin * 60 * 1000)

      const newTitle = svc?.name ?? booking.title ?? 'Appointment'

      const payload = {
        service_id: serviceId || booking.service_id,
        title: newTitle,
        price: svc?.price ?? booking.price,
        price2: svc?.price2 ?? booking.price2,
        start_time: start,
        end_time: end,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: emailAddress,
        notes,
        artist_id: artistProfile.id,
      }

      if (onSaveEdit) {
        await onSaveEdit(booking.id, payload)
      } else {
        const res = await fetch(`/api/bookings/${booking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Update failed')
      }

      try {
        const calendarId = artistProfile.google_calendar_id || 'primary'
        await syncBookingToGoogle({
          bookingId: String(booking.id),
          userId: artistProfile.id,
          calendarId,
          title: newTitle,
          startIso: start.toISOString(),
          endIso: end.toISOString(),
          timezone: 'America/Los_Angeles',
          status: mapNumericStatusToScheddyStatus(booking.status),
          description: notes || undefined,
        })
      } catch (e) {
        console.error('Google sync failed:', e)
      }

      onOpenChange(false)
      router.refresh()
    } catch (e: any) {
      setErr(e?.message || 'There was an issue saving changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Overlay ABOVE header icons (z-[60]) */}
      <SheetOverlay className="fixed inset-0 bg-black/60 z-[95]" />

      {/* Drawer content above everything */}
      <SheetContent
        side="right"
        className="
          z-[100]
          w-full sm:max-w-lg
          p-0
          flex flex-col
          h-dvh max-h-dvh
          [height:100svh]
          bg-[#262626] border-0
        "
      >
        {/* Sticky header */}
        <SheetHeader className="p-6 sticky top-0 z-10 bg-background border-b">
          <SheetTitle>
            {action === 'View' && 'Booking Details'}
            {action === 'Edit' && (canEdit ? 'Edit Booking' : 'Booking (read-only)')}
            {action === 'Cancel' && 'Cancel Booking'}
          </SheetTitle>
          <SheetDescription>
            {action === 'View' && 'Read-only view of this booking.'}
            {action === 'Edit' && (canEdit ? 'Update details and save.' : 'You do not have permission to edit.')}
            {action === 'Cancel' && 'Confirm cancellation below.'}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {open && missingBooking && (
            <div className="mt-2 text-sm">
              No booking selected. Close this panel and try again.
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              </div>
            </div>
          )}

          {!missingBooking && (action === 'View' || action === 'Edit') && (
            <form className="space-y-5" onSubmit={handleEditSave}>
              {/* Service */}
              <div className="space-y-2">
                <Label>Service</Label>
                {readOnly ? (
                  <div className="text-sm">
                    <div className="font-medium">{selectedService?.name ?? booking?.title ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">
                      {!selectedService?.hide_price_while_booking && selectedService
                        ? `${formatServicePrice(selectedService)} · ${convertMinutesToHours(selectedService.duration)}`
                        : convertMinutesToHours(selectedService?.duration ?? 60)}
                    </div>
                  </div>
                ) : (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                  >
                    <option value="">— Select service —</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} {!s.hide_price_while_booking && `· ${formatServicePrice(s)}`} · {convertMinutesToHours(s.duration)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date / Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <div className="mt-1">
                    <DatePicker value={selectedDate} onChange={readOnly ? () => {} : setSelectedDate} />
                  </div>
                </div>
                <div>
                  <Label>Time</Label>
                  <div className="mt-1">
                    <ListTimePicker value={selectedTime} onChange={readOnly ? () => {} : setSelectedTime} />
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>First name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={readOnly} />
                </div>
                <div>
                  <Label>Last name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={readOnly} />
                </div>
              </div>

              <div>
                <Label>Phone number</Label>
                <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={readOnly} />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} disabled={readOnly} />
              </div>

              <div>
                <Label>Notes</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={readOnly}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                             shadow-sm ring-offset-background placeholder:text-muted-foreground
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                             disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {err && <p className="text-red-600 text-xs">{err}</p>}

              <div className="flex justify-end gap-2 pb-24">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {action === 'View' ? 'Close' : 'Cancel'}
                </Button>
                {action === 'Edit' && (
                  <Button type="submit" disabled={!canEdit || saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* CANCEL */}
          {!missingBooking && action === 'Cancel' && booking && (
            <div className="space-y-4 text-sm">
              <div>
                Are you sure you want to cancel this booking?
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>When:</strong>{' '}
                  {new Date(booking.start_time).toLocaleString()} – {new Date(booking.end_time).toLocaleTimeString()}<br />
                  <strong>With:</strong> {booking.artist?.first_name} {booking.artist?.last_name}<br />
                  <strong>Service:</strong> {booking.title ?? '—'}<br />
                  <strong>Price:</strong> ${booking.price?.toFixed(2) ?? '0.00'}
                </div>
              </div>

              <form
                action={async (fd) => {
                  try {
                    await syncBookingToGoogle({
                      bookingId: String(booking.id),
                      userId: artistProfile.id,
                      calendarId: artistProfile.google_calendar_id || 'primary',
                      title: booking.title || 'Appointment',
                      startIso: new Date(booking.start_time).toISOString(),
                      endIso: new Date(booking.end_time).toISOString(),
                      timezone: 'America/Los_Angeles',
                      status: 'Canceled',
                      description: booking.notes || undefined,
                    })
                  } catch (e) {
                    console.error('Google delete sync failed:', e)
                  }
                  await cancelAction(fd)
                }}
                className="flex items-center justify-end gap-2 pt-2"
                onSubmit={() => {
                  setTimeout(() => {
                    onOpenChange(false)
                    router.refresh()
                  }, 50)
                }}
              >
                <input type="hidden" name="bookingId" value={String(booking.id)} />
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Keep Booking
                </Button>
                <Button type="submit" variant="destructive">
                  Confirm Cancel
                </Button>
              </form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
