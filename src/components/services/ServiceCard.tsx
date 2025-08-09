// components/ServiceCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import getHoursFromMinutes from "@/lib/utils/getHoursFromMinutes"

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  duration: number;
  onClick?: () => void;
}

export default function ServiceCard({ title, description, price, duration, onClick }: ServiceCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition duration-300 ease-in-out rounded-2xl border bg-transparent p-1"
    >
      <CardContent className="flex items-start gap-2 p-0">
        <div className="flex items-center justify-center h-8">
            <Image alt='gripdots' src='/assets/icons/grip-dots.png' height={12} width={12}  className="block"/>
        </div>
        <div className="flex flex-col border border-[#3a3a3a] rounded-sm p-3 w-full">
          <h4 className="text-xs text-white font-semibold">{title}</h4>
          <p className="text-[70%] text-[#808080]">${price} - {getHoursFromMinutes(duration)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
