// components/CategoryCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  onClick?: () => void;
}

export default function CategoryCard({ name, onClick }: CategoryCardProps) {
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
          <h4 className="text-xs text-white font-semibold">{name}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
