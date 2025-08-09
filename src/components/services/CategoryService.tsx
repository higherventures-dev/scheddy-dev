'use client';

import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableServiceCard from '@/components/services/SortableServiceCard';

export default function Category({
  category,
  onDragEnd,
}: {
  category: any;
  onDragEnd: (e: any, catId: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div>
      <div className="text-xs text-[#808080] mb-2">{category.name}</div>
      <DndContext sensors={sensors} onDragEnd={(e) => onDragEnd(e, category.id)}>
        <SortableContext
          items={category.services.map((s: any) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {category.services.map((service: any) => (
              <SortableServiceCard key={service.id} service={service} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
