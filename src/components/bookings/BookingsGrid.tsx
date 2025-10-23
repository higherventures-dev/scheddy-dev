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
  bookings?: Booking[]
  cancelAction?: (formData: FormData) => Promise<void>
  services?: Service[]
  artistProfile?: { id: string }
  viewerRole?: ViewerRole
  onSaveEdit?: (id: string | number, payload: any) => Promise<void>
}

export default function BookingsGrid({
  bookings = [],
  cancelAction,
  services = [],
  artistProfile = { id: '' },
  viewerRole = 'artist',
  onSaveEdit,
}: Props) {
  // normalize defensively
  const safeBookings = Array.isArray(bookings) ? bookings : []
  const safeServices = Array.isArray(services) ? services : []

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerAction, setDrawerAction] = React.useState<'View' | 'Edit' | 'Cancel'>('View')
  const [active, setActive] = React.useState<Booking | null>(null)

  // Allow Edit for admin, studio, or artist
  const canEditRole = ['admin', 'studio', 'artist'].includes(viewerRole || 'client')

  if (!safeBookings.length) {
    return <p className="text-center text-gray-500 mt-8">No upcoming bookings.</p>
  }

  return (
    <>
      <BookingActionDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        action={drawerAction}
        booking={active ?? null}
        services={safeServices}
        artistProfile={artistProfile ?? { id: '' }}
        cancelAction={cancelAction}
        canEdit={canEditRole}
        onSaveEdit={onSaveEdit}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {safeBookings.map((b) => {
          // Guard dates
          const startDateTime = b?.start_time ? new Date(b.start_time) : null
          const endDateTime = b?.end_time ? new Date(b.end_time) : null

          const bookingDurationDisplay =
            startDateTime && endDateTime ? getDurationDisplay(b.start_time, b.end_time) : '—'

          const monthAbbr = startDateTime
            ? startDateTime.toLocaleString('default', { month: 'short' }).toUpperCase()
            : '—'

          const dayOfMonth = startDateTime ? startDateTime.getDate() : '—'

          // Two-line date display
          const weekdayFull = startDateTime
            ? startDateTime.toLocaleDateString('en-US', { weekday: 'long' })
            : '—'

          const dateLong = startDateTime
            ? startDateTime.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Date TBD'

          const formattedStartTime = startDateTime
            ? startDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            : '—'

          const formattedEndTime = endDateTime
            ? endDateTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
            : '—'

          const bookingStatus = getBookingStatusInfo(b?.status ?? 0)
          const canCancel = b?.status === 1 || b?.status === 2

          const safePrice =
            typeof b?.price === 'number' && !Number.isNaN(b.price)
              ? b.price.toFixed(2)
              : '0.00'

          const title = b?.title || 'Untitled Booking'
          const artistName =
            [b?.artist?.first_name, b?.artist?.last_name].filter(Boolean).join(' ') ||
            'Unknown artist'

          return (
            <div key={String(b?.id ?? Math.random())} className="space-y-2 p-1 py-4 text-xs">
              <div className="bg-[#3A3A3A] p-4 rounded-lg">
                {/* Top row: date + status (adjusted size & alignment) */}
                <div className="grid grid-cols-6 gap-1 items-start">
                  {/* Date tile: smaller */}
                  <div className="col-span-1 rounded border border-gray-600 w-12">
                    <div className="bg-gray-600 text-[60%] leading-none text-center py-1">
                      {monthAbbr}
                    </div>
                    <div className="text-center text-xs py-1.5 leading-none">{dayOfMonth}</div>
                  </div>

                  {/* Two-line date + time */}
                  <div className="col-span-3 pl-3 min-w-0">
                    <div className="leading-tight">{weekdayFull}</div>
                    <div className="leading-tight">{dateLong}</div>
                    <div className="text-[#808080] text-[90%] mt-0.5">
                      {formattedStartTime} - {formattedEndTime}
                    </div>
                  </div>

                  {/* Status pill: top-right aligned with tight right spacing */}
                  <div className="col-span-2 text-right flex items-start justify-end">
                    <span
                      className="
                        inline-flex items-center rounded-sm
                        px-1.5 py-0.5 gap-1
                        whitespace-nowrap leading-none
                        self-start
                      "
                      style={{ backgroundColor: bookingStatus.color || 'transparent' }}
                    >
                      <Image
                        src={bookingStatus.image}
                        alt={bookingStatus.name}
                        width={16}
                        height={16}
                        className="shrink-0"
                      />
                      <span className="text-[80%] leading-none">{bookingStatus.name}</span>
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
                    {title}
                    <br />
                    <span className="text-[#808080] text-[90%]">
                      {artistName} - {bookingDurationDisplay}
                    </span>
                  </div>
                  <div className="col-span-1 pr-3 text-[90%]">${safePrice}</div>
                </div>

                {/* Divider + actions row */}
                <hr className="border-[#4a4a4a] mt-4" />
                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-[0.65rem] bg-[#313131]"
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
                      className="h-7 px-3 text-[0.65rem] bg-[#313131]"
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
                      className="h-7 px-3 text-[0.65rem] bg-[#313131]"
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
