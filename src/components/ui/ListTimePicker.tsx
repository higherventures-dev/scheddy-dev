'use client';

interface ListTimePickerProps {
  value: string | null;
  onChange: (value: string) => void;
  interval?: number;
}

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

export default function ListTimePicker({ value, onChange, interval = 30 }: ListTimePickerProps) {
  const timeOptions = generateTimeOptions(interval);

  return (
    <div className="text-white text-xs">
      <label className="block mb-1">Select a time:</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
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
