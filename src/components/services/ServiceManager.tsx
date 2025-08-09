'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CategoryService from '@/components/services/CategoryService';
//import AddNewButton from '@/components/services/AddNewButton';

export default function ServiceManager({ artistId }: { artistId: string }) {
  const [categories, setCategories] = useState<any[]>([]);

  const supabase = createClient();

  const fetchCategoriesWithServices = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select(`*, services!fk_service_category(*)`)
      .eq('user_id', artistId)
      .order('order_index');

    if (!error) setCategories(data);
    else console.error(error);
  };

  useEffect(() => {
    fetchCategoriesWithServices();
  }, []);

  const handleDragEnd = async (event: any, catId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const category = categories.find((c) => c.id === catId);
    const oldIndex = category.services.findIndex((s: any) => s.id === active.id);
    const newIndex = category.services.findIndex((s: any) => s.id === over.id);

    const reordered = arrayMove(category.services, oldIndex, newIndex);
    const updates = reordered.map((s: any, idx: number) => ({ ...s, order_index: idx }));

    // Update on server
    for (const service of updates) {
      await supabase.from('services').update({ order_index: service.order_index }).eq('id', service.id);
    }

    // Update local state
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, services: updates } : c
      )
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        {/* <AddNewButton artistId={artistId} onUpdate={fetchCategoriesWithServices} /> */}
      </div>
      <div className="space-y-6">
        {categories.map((category) => (
          <CategoryService
            key={category.id}
            category={category}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}
