'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

type Service = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  price_type: 'fixed' | 'free' | 'from' | 'hourly' | 'hidden' | null;
  price: number | null;
  duration_minutes: number | null;
  deleted_at: string | null;
};

interface ServiceManagerProps {
  artistId: string;        // 👈 from parent
  refreshToken?: number;   // 👈 parent bumps to re-fetch
}

const HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS = true;

export default function ServiceManager({ artistId, refreshToken = 0 }: ServiceManagerProps) {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null); // to disable buttons per-row

  const query = useMemo(() => {
    let q = supabase
      .from('services')
      .select('id,profile_id,name,description,price_type,price,duration_minutes,deleted_at')
      .eq('profile_id', artistId)
      .order('name', { ascending: true });
    if (!showArchived) q = q.is('deleted_at', null);
    return q;
  }, [supabase, artistId, showArchived]);

  async function fetchServices() {
    setLoading(true);
    setErr(null);
    const { data, error } = await query;
    if (error) setErr(error.message);
    setServices(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId, showArchived, refreshToken]);

  const archiveService = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('services')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchServices();
  };

  const unarchiveService = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('services')
      .update({ deleted_at: null })
      .eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchServices();
  };

  const hardDeleteService = async (id: string) => {
    if (!HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS) return;
    if (!confirm('Permanently delete this service? This cannot be undone.')) return;

    // Block delete if any bookings reference it
    const { count, error: cErr } = await supabase
      .from('bookings')
      .select('id', { head: true, count: 'exact' })
      .eq('service_id', id);

    if (cErr) return setErr(cErr.message);
    if ((count ?? 0) > 0) {
      return setErr('This service has bookings in history. You can archive it, but not delete permanently.');
    }

    setBusyId(id);
    const { error } = await supabase.from('services').delete().eq('id', id);
    setBusyId(null);
    if (error) return setErr(error.message);
    fetchServices();
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
          onClick={() => fetchServices()}
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-[#bbb]">Loading services…</p>
      ) : services.length === 0 ? (
        <p className="text-xs text-[#bbb]">No services found.</p>
      ) : (
        <ul className="divide-y divide-[#444] border border-[#444] rounded-md">
          {services.map((s) => {
            const isArchived = !!s.deleted_at;
            const duration = s.duration_minutes ?? 0;
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return (
              <li key={s.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.name}</span>
                    {isArchived && (
                      <span className="text-[10px] px-2 py-[2px] rounded bg-[#555] text-white">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#aaa]">
                    {s.price_type ?? '—'}
                    {s.price_type && s.price_type !== 'free' && s.price != null ? ` • $${s.price.toFixed(2)}` : ''}
                    {' • '}
                    {hours ? `${hours}h` : ''}{minutes ? `${minutes}m` : !hours ? '0m' : ''}
                  </div>
                  {s.description && (
                    <div className="text-[11px] text-[#aaa] line-clamp-1">{s.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
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
                  {HARD_DELETE_ALLOWED_WHEN_NO_BOOKINGS && (
                    <Button
                      disabled={busyId === s.id}
                      onClick={() => hardDeleteService(s.id)}
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
