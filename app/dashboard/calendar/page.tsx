import SchedulerCalendar from '@/components/SchedulerCalendar';

export default function SchedulePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Calendar</h1>
      <SchedulerCalendar /> {/* ✅ safe because it's a client component */}
    </div>
  );
}