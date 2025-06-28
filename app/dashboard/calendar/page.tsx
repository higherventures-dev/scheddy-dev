import SchedulerCalendar from '@/components/SchedulerCalendar';

export default function SchedulePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Schedule</h1>
      <SchedulerCalendar /> {/* ✅ safe because it's a client component */}
    </div>
  );
}