export default function getHoursFromMinutes(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) return `${hrs} hours ${mins} mins`;
  if (hrs) return `${hrs} hours`;
  return `${mins} mins`;
}