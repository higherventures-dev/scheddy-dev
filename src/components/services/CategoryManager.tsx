'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { arrayMove } from '@dnd-kit/sortable';
import CategoryList from '@/components/services/CategoryList';

export default function CategoryManager({ userId }: { userId: string }) {
  const [categories, setCategories] = useState<any[]>([]);

  const supabase = createClient();

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('order_index');

    if (!error && data) setCategories(data);
    else console.error(error);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categories, oldIndex, newIndex);
    const updates = reordered.map((c, idx) => ({ ...c, order_index: idx }));

    // Update on server
    for (const category of updates) {
      await supabase
        .from('categories')
        .update({ order_index: category.order_index })
        .eq('id', category.id);
    }

    // Update local state
    setCategories(updates);
  };

  return (
    <div className="p-4">
      <CategoryList categories={categories} onDragEnd={handleDragEnd} />
    </div>
  );
}
