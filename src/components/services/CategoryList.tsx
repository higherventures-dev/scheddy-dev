'use client';

import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCategoryCard from '@/components/services/SortableCategoryCard';

export default function CategoryList({
  categories,
  onDragEnd,
}: {
  categories: any[];
  onDragEnd: (event: any) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <SortableCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
