'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event as RBCEvent, ToolbarProps } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { createClient } from '@/utils/supabase/client';

import { BookingDrawer } from '@/components/BookingDrawer';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type BookingEvent = RBCEvent & {
  id: string;
  client_id: string;
  user_id: string;
  status: number;
  description?: string;
  start_time?: string | Date;
  end_time?: string | Date;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email_address?: string;
  price: number;
};

function hexToRgba(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Custom event renderer
const ColoredEvent = ({ event }: { event: BookingEvent }) => {
  let backgroundColor = '#9E9E9E'; // Default gray
  switch (event.status) {
    case 1:
      backgroundColor = '#4CAF50';
      break;
    case 0:
      backgroundColor = '#FFC107';
      break;
    case -1:
      backgroundColor = '#F44336';
      break;
  }

  return (
    <div
      style={{
        position: 'relative',
        borderLeft: `6px solid ${backgroundColor}`,
        borderRadius: '6px',
        padding: '8px 12px',
        overflow: 'hidden',
        fontSize: '0.75rem',
        color: backgroundColor,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: hexToRgba(backgroundColor, 0.2),
          zIndex: 0,
          borderRadius: '6px',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }} className="text-[90%]">
        <strong>{event.title}</strong>
        <div style={{ opacity: 0.75 }} className="text-[90%]">
          {event.start_time &&
            event.end_time &&
            `${new Date(event.start_time).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })} - ${new Date(event.end_time).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}`}
        </div>
      </div>
    </div>
  );
};

export default function SchedulerCalendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
  const defaultDate = useMemo(() => new Date(), []);
  const [date, setDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('week');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'delete' | 'add'>('view');

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

const fetchBookings = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from('bookings').select('*');

  if (error) {
    console.error(error);
    return;
  }

  const mapped = (data || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    start_time: new Date(b.start_time),
    end_time: new Date(b.end_time),
    user_id: b.user_id,
    client_id: b.client_id,
    status: b.status,
    description: b.notes || '',
    first_name: b.first_name,
    last_name: b.last_name,
    phone_number: b.phone_number,
    email_address: b.email_address,
    notes: b.notes,
    price: b.price,
  }));

  setEvents(mapped);
};

useEffect(() => {
  fetchBookings();
}, []);

const refreshCalendar = () => {
  fetchBookings(); // Simply reuse the logic
};  

  
  return (
    <div className="scheddy-calendar text-xs h-full w-full">
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={currentView}
        onView={(newView) => setCurrentView(newView as typeof currentView)}
        formats={{
          weekdayFormat: (date, culture, localizer) => format(date, 'EEE d'),
        }}
        onNavigate={(newDate) => setDate(newDate)}
        startAccessor="start_time"
        endAccessor="end_time"
        defaultDate={defaultDate}
        views={['month', 'week', 'day', 'agenda']}
        components={{
          event: ColoredEvent,
        }}
        onSelectEvent={(event) => {
          setSelectedBooking(event as BookingEvent);
          setDrawerMode('view');
          setDrawerOpen(true);
        }}
        style={{ height: '100%' }}
        eventPropGetter={(event) => {
          let backgroundColor = '#9E9E9E';
          switch (event.status) {
            case 1:
              backgroundColor = '#4CAF50';
              break;
            case 0:
              backgroundColor = '#FFC107';
              break;
            case -1:
              backgroundColor = '#F44336';
              break;
          }
          return {
            style: {
              backgroundColor: hexToRgba(backgroundColor, 0.2),
              borderLeft: `6px solid ${backgroundColor}`,
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.75rem',
              color: '#fff',
              minHeight: '40px',
            },
          };
        }}
      />

      {/* legacy modal can be removed if drawer fully replaces it */}
      {/* {selectedBooking && !drawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-600 p-6 rounded-md w-96 shadow-lg relative text-white">
            <h2 className="font-bold mb-2">{selectedBooking.title}</h2>
            <p>
              <strong>Start:</strong> {new Date(selectedBooking.start_time!).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {new Date(selectedBooking.end_time!).toLocaleString()}
            </p>
            <p>
              <strong>Client ID:</strong> {selectedBooking.client_id}
            </p>
            <p>
              <strong>User ID:</strong> {selectedBooking.user_id}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-2 right-2 text-sm text-white hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )} */}

      <BookingDrawer
        open={drawerOpen}
        initialData={selectedBooking}
        onClose={handleCloseDrawer}
        onRefresh={refreshCalendar}
        mode={drawerMode}
      />
    </div>
  );
}