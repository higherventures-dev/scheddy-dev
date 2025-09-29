// src/components/services/CategoryList.tsx
'use client';

import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableCategoryCard from '@/components/services/SortableCategoryCard';

type Category = {
  id: string;
  name: string;
  description?: string | null;
  order_index?: number | null;
  deleted_at?: string | null;
};

export default function CategoryList({
  categories,
  onDragEnd,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
  canDelete,
  busyId,
}: {
  categories: Category[];
  onDragEnd: (event: any) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (category: Category) => void;
  canDelete: (id: string) => boolean;
  busyId: string | null;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <SortableCategoryCard
              key={category.id}
              category={category}
              onArchive={() => onArchive(category.id)}
              onUnarchive={() => onUnarchive(category.id)}
              onDelete={() => onDelete(category.id)}
              onEdit={() => onEdit(category)}
              canDelete={canDelete(category.id)}
              busy={busyId === category.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
