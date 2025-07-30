'use client';

import { useState } from 'react';

const generateTimeOptions = (interval = 30) => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const h = displayHour.toString().padStart(2, '0');
      const m = min.toString().padStart(2, '0');
      times.push(`${h}:${m} ${period}`);
    }
  }
  return times;
};

export default function ListTimePicker() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const timeOptions = generateTimeOptions(30); // You can adjust the interval here

  return (
    <div className="w-full max-w-xs mx-auto text-white text-xs p-1">
      <label className="block mb-1">Select a time:</label>
      <select
        value={selectedTime || ''}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="block w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="" disabled>
          -- Choose a time --
        </option>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}