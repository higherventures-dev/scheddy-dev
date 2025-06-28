'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
//import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createClient } from '@/utils/supabase/client';

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
};

export default function SchedulerCalendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const defaultDate = useMemo(() => new Date(), []);

  useEffect(() => {
    const fetchBookings = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('bookings')
        .select('id, title, start_time, end_time, user_id, client_id');

      if (error) {
        console.error(error);
        return;
      }

      const mapped = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        start: new Date(b.start_time),
        end: new Date(b.end_time),
        user_id: b.user_id,
        client_id: b.client_id,
      }));

      setEvents(mapped);
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ height: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        defaultDate={defaultDate}
        style={{ height: '100%' }}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-600 p-6 rounded-md w-96 shadow-lg relative text-white">
            <h2 className="text-lg font-bold mb-2 text-white">{selectedEvent.title}</h2>
            <p><strong className="text-white">Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong className="text-white">End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p><strong className="text-white">Client ID:</strong> {selectedEvent.client_id}</p>
            <p><strong className="text-white">User ID:</strong> {selectedEvent.user_id}</p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
