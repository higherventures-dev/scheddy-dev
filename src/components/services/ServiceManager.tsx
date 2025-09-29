// src/components/services/ServiceManager.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

type ServiceRow = {
  id: string;
  profile_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price_type: number | null;     // smallint (1..5)
  price: number | null;
  duration_minutes: number | null;
  deleted_at: string | null;
};

type Category = { id: string; name: string };

const CODE_TO_PRICE_TYPE: Record<number, 'fixed' | 'free' | 'from' | 'hourly' | 'hidden'> = {
  1: 'fixed',
  2: 'free',
  3: 'from',
  4: 'hourly',
  5: 'hidden',
};

function formatDuration(mins: number | null) {
  const m = Math.max(0, mins ?? 0);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h && r) return `${h}h ${r}m`;
  if (h) return `${h}h`;
  return `${r}m`;
}

function formatPrice(code: number | null, price: number | null) {
  if (!code) return '—';
  const t = CODE_TO_PRICE_TYPE[code];
  if (t === 'free') return 'Free';
  if (t === 'hidden') return '—';
  if (price == null) return '—';
  const p = Number(price).toFixed(2);
  if (t === 'hourly') return `$${p}/hr`;
  if (t === 'from') return `From $${p}`;
  return `$${p}`;
}

export default function ServiceManager({
  artistId,
  refreshToken = 0,
}: {
  artistId: string;
  refreshToken?: number;
}) {
  const supabase = createClient();
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const catNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const fetchAll = async () => {
    setLoading(true);
    setErr(null);

    // fetch categories for name lookup
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select('id,name')
      .eq('user_id', artistId);

    if (catErr) {
      setErr(catErr.message);
    } else {
      setCategories((cats ?? []) as Category[]);
    }

    // fetch services
    let svcQuery = supabase
      .from('services')
      .select('id,profile_id,category_id,name,description,price_type,price,duration_minutes,deleted_at')
      .eq('profile_id', artistId) // your services table uses profile_id
      .order('name', { ascending: true });

    if (!showArchived) {
      svcQuery = svcQuery.is('deleted_at', null);
    }

    const { data: svcs, error: svcErr } = await svcQuery;
    if (svcErr) {
      setErr((e) => e ?? svcErr.message);
      setServices([]);
    } else {
      setServices((svcs ?? []) as ServiceRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId, showArchived, refreshToken]);

  const archiveService = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('services')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    fetchAll();
  };

  const unarchiveService = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('services')
      .update({ deleted_at: null })
      .eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    fetchAll();
  };

  const deleteService = async (id: string) => {
    // optional: prevent deleting if bookings exist; otherwise delete
    setBusyId(id);
    const { error } = await supabase.from('services').delete().eq('id', id);
    setBusyId(null);
    if (error) { setErr(error.message); return; }
    fetchAll();
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
      ) : services.length === 0 ? (
        <p className="text-xs text-[#bbb]">No services yet.</p>
      ) : (
        <ul className="space-y-2">
          {services.map((s) => {
            const isArchived = !!s.deleted_at;
            const catName = s.category_id ? catNameById.get(s.category_id) ?? '—' : '—';
            return (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-md border border-[#444] bg-[#2d2d2d] p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{s.name}</div>
                    {isArchived && (
                      <span className="shrink-0 rounded bg-[#555] px-2 py-[2px] text-[10px] text-white">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#aaa]">
                    {catName} • {formatPrice(s.price_type, s.price)} • {formatDuration(s.duration_minutes)}
                  </div>
                  {s.description && (
                    <div className="truncate text-[11px] text-[#9a9a9a]">{s.description}</div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!isArchived ? (
                    <Button
                      disabled={busyId === s.id}
                      onClick={() => archiveService(s.id)}
                      className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button
                      disabled={busyId === s.id}
                      onClick={() => unarchiveService(s.id)}
                      className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
                    >
                      Unarchive
                    </Button>
                  )}
                  <Button
                    disabled={busyId === s.id}
                    onClick={() => deleteService(s.id)}
                    className="text-xs bg-red-600 text-white px-3 py-1 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
