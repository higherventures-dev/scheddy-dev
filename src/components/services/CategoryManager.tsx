// src/components/services/CategoryManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import CategoryList from '@/components/services/CategoryList';
import NewCategoryModal from '@/components/forms/services/NewCategoryModal';
import { arrayMove } from '@dnd-kit/sortable';

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  order_index: number | null;
  deleted_at: string | null;
};

type EditingCategory = {
  id: string;
  name: string;
  description?: string | null;
};

export default function CategoryManager({
  userId,
  refreshToken = 0,
}: {
  userId: string;
  refreshToken?: number;
}) {
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [catsWithServices, setCatsWithServices] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editing, setEditing] = useState<EditingCategory | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);

    let catsQuery = supabase
      .from('categories')
      .select('id,user_id,name,description,order_index,deleted_at')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })
      .order('name', { ascending: true });

    if (!showArchived) catsQuery = catsQuery.is('deleted_at', null);

    const { data: cats, error: catsErr } = await catsQuery;
    if (catsErr) {
      setErr(catsErr.message);
      setLoading(false);
      return;
    }
    setCategories((cats as CategoryRow[]) ?? []);

    const catIds = (cats ?? []).map((c: any) => c.id) as string[];
    const attachedSet = new Set<string>();

    if (catIds.length > 0) {
      const { data: svcs, error: svcErr } = await supabase
        .from('services')
        .select('category_id');
      if (!svcErr && svcs) {
        (svcs as Array<{ category_id: string | null }>).forEach((s) => {
          if (s.category_id && catIds.includes(s.category_id)) attachedSet.add(s.category_id);
        });
      } else if (svcErr) {
        setErr((prev) => prev ?? svcErr.message);
      }
    }
    setCatsWithServices(attachedSet);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, showArchived, refreshToken]);

  const onDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categories, oldIndex, newIndex);
    const updates = reordered.map((c, idx) => ({ ...c, order_index: idx }));

    setCategories(updates);
    for (const c of updates) {
      await supabase.from('categories').update({ order_index: c.order_index }).eq('id', c.id);
    }
  };

  const archiveCategory = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('categories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    await fetchData();
  };

  const unarchiveCategory = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from('categories')
      .update({ deleted_at: null })
      .eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    await fetchData();
  };

  const deleteCategory = async (id: string) => {
    if (catsWithServices.has(id)) { setErr('This category has services attached. Archive it instead.'); return; }
    setBusyId(id);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    await fetchData();
  };

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived
        </label>
        {err && <span className="text-xs text-red-400">{err}</span>}
      </div>

      {loading ? (
        <p className="text-xs text-[#bbb]">Loading…</p>
      ) : (
        <CategoryList
          categories={categories}
          onDragEnd={onDragEnd}
          onArchive={archiveCategory}
          onUnarchive={unarchiveCategory}
          onDelete={deleteCategory}
          onEdit={(cat) => setEditing({ id: cat.id, name: cat.name, description: cat.description ?? '' })}
          canDelete={(id) => !catsWithServices.has(id)}
          busyId={busyId}
        />
      )}

      <NewCategoryModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSuccess={async () => { setEditing(null); await fetchData(); }}
        category={editing ?? undefined}
      />
    </div>
  );
}
