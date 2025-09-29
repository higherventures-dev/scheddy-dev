'use client';

import { useMemo, useState } from 'react';

type ScheddyStatus = 'Unconfirmed' | 'Confirmed' | 'No-show' | 'Canceled' | 'Completed';

const HEX = {
  gray:  '#969696',
  blue:  '#69AADE',
  yellow:'#E5C26A',
  red:   '#FF5C66',
  green: '#80CF93',
};

function pad(n: number) { return String(n).padStart(2, '0'); }
function buildTimeOptions() {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 30) out.push(`${pad(h)}:${pad(m)}`);
  return out;
}

export default function GoogleDebugPage() {
  const today = useMemo(() => new Date(), []);
  const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Next nearest half hour
  const defaultTime = useMemo(() => {
    const d = new Date();
    const mins = d.getMinutes();
    const next = mins < 30 ? 30 : 60;
    d.setMinutes(next, 0, 0);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, []);

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [duration, setDuration] = useState(60);
  const [title, setTitle] = useState('Scheddy Status Test');
  const [bookingId, setBookingId] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [pending, setPending] = useState(false);

  const times = useMemo(() => buildTimeOptions(), []);

  async function fire(status: ScheddyStatus) {
    setPending(true);
    setResult(null);
    try {
      const res = await fetch('/api/google/debug/sync-status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingId || undefined,
          title,
          date,
          time,
          durationMinutes: duration,
          timezone: 'America/Los_Angeles',
          status,
        }),
      });
      const json = await res.json();
      setResult(json);
      if (json?.bookingId && !bookingId) setBookingId(json.bookingId);
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || String(e) });
    } finally {
      setPending(false);
    }
  }

  function resetBookingId() {
    setBookingId('');
  }

  // Common dark input style
  const inputClass =
    'border border-gray-600 rounded-md px-3 py-2 bg-[#313131] text-white placeholder-gray-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-gray-400';

  // helper style for colored status buttons with good contrast
  const btn = (bg: string, label: string, onClick: () => void, darkText?: boolean) => (
    <button
      onClick={onClick}
      disabled={pending}
      style={{ backgroundColor: bg }}
      className={`px-3 py-2 rounded transition disabled:opacity-50 ${darkText ? 'text-black' : 'text-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Google Calendar Status Smoke Test</h1>

      {/* Inputs (dark) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Date</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Time</span>
          <select
            value={time}
            onChange={e => setTime(e.target.value)}
            className={inputClass}
          >
            {times.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Duration</span>
          <select
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value, 10))}
            className={inputClass}
          >
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-300">Title</span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Scheddy Status Test"
          />
        </label>
      </div>

      {/* Booking ID (dark input) + matching small button */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">Booking ID:</span>
        <input
          readOnly
          value={bookingId || '(set on first create)'}
          className={`${inputClass} text-xs w-full`}
        />
        <button
          type="button"
          onClick={resetBookingId}
          className="text-xs px-3 py-2 rounded border border-gray-600 bg-[#313131] text-white hover:bg-[#3a3a3a]"
        >
          New Booking ID
        </button>
      </div>

      {/* Status buttons with your exact colors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {btn(HEX.blue,   'Confirmed',         () => fire('Confirmed'))}     {/* confirmed (blue) */}
        {btn(HEX.gray,   'Unconfirmed',       () => fire('Unconfirmed'))}   {/* tentative (gray) */}
        {btn(HEX.yellow, 'No-show',           () => fire('No-show'), true)} {/* tentative (yellow) */}
        {btn(HEX.green,  'Completed',         () => fire('Completed'), true)}/* confirmed (green) */
        {btn(HEX.red,    'Cancel (Delete)',   () => fire('Canceled'))}      {/* delete */}
      </div>

      <div className="text-sm text-gray-400">
        Tip: Click <em>Confirmed</em> first to create the event, then try other statuses with the same Booking ID.
        <em> Cancel</em> will delete it.
      </div>

      {/* Last response (dark textarea) */}
      <div className="mt-4">
        <h2 className="font-medium mb-2">Last response</h2>
        <textarea
          readOnly
          value={JSON.stringify(result, null, 2)}
          className={`${inputClass} w-full h-56 text-xs font-mono`}
        />
      </div>
    </div>
  );
}
