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
      backgroundColor = '#969696';
      break;
    case 2:
      backgroundColor = '#69AADE';
      break;
    case 3:
      backgroundColor = '#E5C26A';
      break;
    case 4:
      backgroundColor = '#FF5C66';
      break;
    case 5:
      backgroundColor = '#008800';
      break;
  }

  return (
    <div
      style={{
        position: 'relative',
        borderLeft: `6px solid ${backgroundColor}`,
        borderRadius: '6px',
        padding: '8px 24px 8px 12px',
        fontSize: '0.75rem',
        color: backgroundColor,
         height: '100%',        
    boxSizing: 'border-box',
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
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
      />
     <div style={{ position: 'relative', zIndex: 1 }} className="text-[90%]">
  <div className="text-white py-1 text-[100%]">
    {event.first_name + " " + event.last_name}
  </div>
  <strong style={{
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    lineHeight: '140%',
    fontSize: '90%',
    color: 'white',  // ensure contrast
  }}>
    {event.title}
  </strong>
  <div className="text-white text-[90%] mt-1">
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
  
  const minTime = useMemo(() => {
  const dt = new Date(date);
  dt.setHours(0, 0, 0, 0);
  return dt;
}, [date]);

const maxTime = useMemo(() => {
  const dt = new Date(date);
  dt.setHours(23, 59, 59, 999);
  return dt;
}, [date]);


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
    start: new Date(b.start_time),
    end: new Date(b.end_time),
    start_time: b.start_time,
    end_time: b.end_time,
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
  console.log('Mapped events:', mapped);
  setEvents(mapped);
};

useEffect(() => {
  fetchBookings();
}, [currentView, date]); // Fetch bookings on view or date change

const refreshCalendar = () => {
  fetchBookings(); // Simply reuse the logic
};  

  
  return (
    <div className="scheddy-calendar text-xs h-full w-full">
      <Calendar
        toolbar={true}
        localizer={localizer}
        step={60}
        timeslots={1}
         min={minTime}
          max={maxTime}
        events={events}
        date={date}
        view={currentView}
        onView={(newView) => {
  setCurrentView(newView as typeof currentView);
}}
        formats={{
          weekdayFormat: (date, culture, localizer) => format(date, 'EEE'),
          dayFormat: (date, culture, localizer) =>
      localizer.format(date, 'eeee, MMMM d', culture),

}}
        onNavigate={(newDate) => {
  setDate(newDate);
}}
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
        style={{ height: 700 }}
        eventPropGetter={(event) => {
          let backgroundColor = '#969696';
          switch (event.status) {
            case 1:
              backgroundColor = '#969696';
              break;
            case 2:
              backgroundColor = '#69AADE';
              break;
            case 3:
              backgroundColor = '#E5C26A';
              break;
            case 4:
              backgroundColor = '#FF5C66';
              break;
            case 5:
              backgroundColor = '#80CF93';
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