'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

type Category = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  deleted_at: string | null;
};

interface CategoryManagerProps {
  userId: string;          // 👈 from parent
  refreshToken?: number;   // 👈 parent bumps to re-fetch
}

const HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS = true;

export default function CategoryManager({ userId, refreshToken = 0 }: CategoryManagerProps) {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = useMemo(() => {
    let q = supabase
      .from('categories')
      .select('id,user_id,name,description,deleted_at')
      .eq('user_id', userId)
      .order('name', { ascending: true });
    if (!showArchived) q = q.is('deleted_at', null);
    return q;
  }, [supabase, userId, showArchived]);

  async function fetchCategories() {
    setLoading(true);
    setErr(null);
    const { data, error } = await query;
    if (error) setErr(error.message);
    setCategories(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, showArchived, refreshToken]);

  const archiveCategory = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('categories')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchCategories();
  };

  const unarchiveCategory = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('categories')
      .update({ deleted_at: null })
      .eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchCategories();
  };

  const hardDeleteCategory = async (id: string) => {
    if (!HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS) return;
    if (!confirm('Permanently delete this category? This cannot be undone.')) return;

    // Block delete if any bookings reference it
    const { count, error: cErr } = await supabase
      .from('bookings')
      .select('id', { head: true, count: 'exact' })
      .eq('category_id', id);

    if (cErr) return setErr(cErr.message);
    if ((count ?? 0) > 0) {
      return setErr('This category has bookings in history. You can archive it, but not delete permanently.');
    }

    setBusyId(id);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchCategories();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <label className="text-xs inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
          {err && <span className="text-red-400 text-xs">{err}</span>}
        </div>
        <Button
          className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
          onClick={() => fetchCategories()}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-[#bbb]">Loading categories…</p>
      ) : categories.length === 0 ? (
        <p className="text-xs text-[#bbb]">No categories found.</p>
      ) : (
        <ul className="divide-y divide-[#444] border border-[#444] rounded-md">
          {categories.map((c) => {
            const isArchived = !!c.deleted_at;
            return (
              <li key={c.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.name}</span>
                    {isArchived && (
                      <span className="text-[10px] px-2 py-[2px] rounded bg-[#555] text-white">
                        Archived
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <div className="text-[11px] text-[#aaa] line-clamp-1">{c.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isArchived ? (
                    <Button
                      disabled={busyId === c.id}
                      onClick={() => archiveCategory(c.id)}
                      className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button
                      disabled={busyId === c.id}
                      onClick={() => unarchiveCategory(c.id)}
                      className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
                    >
                      Unarchive
                    </Button>
                  )}
                  {HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS && (
                    <Button
                      disabled={busyId === c.id}
                      onClick={() => hardDeleteCategory(c.id)}
                      className="text-xs bg-red-600 text-white px-3 py-1 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
