// components/bookings/BookingsGrid.tsx
'use client'

import * as React from 'react'
import type { Booking } from '@/lib/types/booking'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { getDurationDisplay } from '@/lib/utils/getDurationDisplay'
import { getBookingStatusInfo } from '@/lib/utils/getBookingStatusInfo'
import BookingActionDrawer from '@/components/bookings/BookingActionDrawer'

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

type ViewerRole = 'client' | 'artist' | 'admin' | 'studio'

type Props = {
  bookings: Booking[]
  cancelAction: (formData: FormData) => Promise<void>
  services: Service[]
  artistProfile: { id: string }
  viewerRole?: ViewerRole // Edit allowed for 'admin' | 'studio' | 'artist'
  onSaveEdit?: (id: string | number, payload: any) => Promise<void>
}

export default function BookingsGrid({
  bookings,
  cancelAction,
  services,
  artistProfile,
  viewerRole = 'artist',
  onSaveEdit,
}: Props) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerAction, setDrawerAction] = React.useState<'View' | 'Edit' | 'Cancel'>('View')
  const [active, setActive] = React.useState<Booking | null>(null)

  // Allow Edit for admin, studio, or artist
  const canEditRole = ['admin', 'studio', 'artist'].includes(viewerRole)

  if (!bookings?.length) {
    return <p className="text-center text-gray-500 mt-8">No upcoming bookings.</p>
  }

  return (
    <>
      <BookingActionDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        action={drawerAction}
        booking={active ?? null}
        services={services}
        artistProfile={artistProfile}
        cancelAction={cancelAction}
        canEdit={canEditRole}
        onSaveEdit={onSaveEdit}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {bookings.map((b) => {
          const startDateTime = new Date(b.start_time)
          const endDateTime = new Date(b.end_time)
          const bookingDurationDisplay = getDurationDisplay(b.start_time, b.end_time)
          const monthAbbr = startDateTime.toLocaleString('default', { month: 'short' }).toUpperCase()
          const dayOfMonth = startDateTime.getDate()
          const formattedLongDateWithDay = startDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
          const formattedStartTime = startDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
          const formattedEndTime = endDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

          const bookingStatus = getBookingStatusInfo(b.status)
          const canCancel = b.status === 1 || b.status === 2

          return (
            <div key={String(b.id)} className="space-y-2 p-1 py-4 text-xs">
              <div className="bg-[#3A3A3A] p-4 rounded-lg">
                {/* Top row: date + status */}
                <div className="grid grid-cols-6 gap-1">
                  <div className="col-span-1 rounded border border-gray-600">
                    <div className="bg-gray-600 text-[70%] text-center">{monthAbbr}</div>
                    <div className="text-center text-[100%] pt-2 pb-2">{dayOfMonth}</div>
                  </div>

                  <div className="col-span-3 pl-4">
                    {formattedLongDateWithDay}
                    <br />
                    <span className="text-[#808080] text-[90%]">
                      {formattedStartTime} - {formattedEndTime}
                    </span>
                  </div>

                  <div className="col-span-2 pr-1 text-right flex items-center justify-end gap-2">
                    <span
                      className="inline-flex items-center rounded-sm px-1"
                      style={{ backgroundColor: bookingStatus.color || 'transparent' }}
                    >
                      <Image
                        src={bookingStatus.image}
                        alt={bookingStatus.name}
                        width={16}
                        height={16}
                        className="mr-1"
                      />
                      <span className="text-[90%]">{bookingStatus.name}</span>
                    </span>
                  </div>
                </div>

                {/* Middle row: service + artist + price */}
                <div className="grid grid-cols-6 gap-1 pt-4">
                  <div className="col-span-1 rounded border border-gray-600">
                    <Image
                      src="/assets/images/product.png"
                      alt=""
                      width={20}
                      height={20}
                      className="mx-auto pt-3 pb-3"
                    />
                  </div>
                  <div className="col-span-4 pl-4">
                    {b.title}
                    <br />
                    <span className="text-[#808080] text-[90%]">
                      {b.artist?.first_name} {b.artist?.last_name} - {bookingDurationDisplay}
                    </span>
                  </div>
                  <div className="col-span-1 pr-3 text-[90%]">${b.price?.toFixed(2) ?? '0.00'}</div>
                </div>

                {/* Divider + actions row (prevents layout shift) */}
                <hr className="border-[#4a4a4a] mt-4" />
                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-[0.65rem]"
                    onClick={() => {
                      setActive(b)
                      setDrawerAction('View')
                      setDrawerOpen(true)
                    }}
                  >
                    View
                  </Button>

                  {canEditRole && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 px-3 text-[0.65rem]"
                      onClick={() => {
                        setActive(b)
                        setDrawerAction('Edit')
                        setDrawerOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 px-3 text-[0.65rem]"
                      onClick={() => {
                        setActive(b)
                        setDrawerAction('Cancel')
                        setDrawerOpen(true)
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
