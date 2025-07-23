'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function TimeSelect() {
  const hours = Array.from({ length: 12 * 2 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const suffix = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${suffix}`;
  });

  return (
    <Select onValueChange={(value) => console.log("Selected:", value)}>
      <SelectTrigger className="w-[180px] bg-zinc-900 text-white border-zinc-700 text-xs">
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 text-white">
        {hours.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}