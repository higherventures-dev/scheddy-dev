'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type PriceType = 'fixed' | 'free' | 'from' | 'hourly' | 'hidden';
type CategoryOption = { id: string; name: string };

// Map UI values -> smallint codes in DB
const PRICE_TYPE_TO_CODE: Record<PriceType, number> = {
  fixed: 1,
  free: 2,
  from: 3,
  hourly: 4,
  hidden: 5,
};

const ServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  priceType: z.enum(['fixed', 'free', 'from', 'hourly', 'hidden']),
  price: z.number({ invalid_type_error: 'Price must be a number' }).nonnegative('Price cannot be negative').optional(),
  hours: z.number().int().min(0),
  minutes: z.number().int().min(0).max(59),
}).superRefine((val, ctx) => {
  const needsPrice = val.priceType === 'fixed' || val.priceType === 'from' || val.priceType === 'hourly';
  if (needsPrice && (val.price === undefined || Number.isNaN(val.price) || val.price <= 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['price'], message: 'Price is required and must be > 0 for this price type' });
  }
  const total = val.hours * 60 + val.minutes;
  if (total <= 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['minutes'], message: 'Duration must be greater than 0' });
  }
});

interface NewServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // notify parent to refresh
}

export default function NewServiceModal({ open, onOpenChange, onSuccess }: NewServiceModalProps) {
  const supabase = createClient();

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [priceType, setPriceType] = useState<PriceType>('fixed');
  const [priceInput, setPriceInput] = useState<string>(''); // raw input, parsed on save
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(30);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // categories
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [catsError, setCatsError] = useState<string | null>(null);

  const priceIsRequired = useMemo(
    () => priceType === 'fixed' || priceType === 'from' || priceType === 'hourly',
    [priceType]
  );

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategoryId('');
    setPriceType('fixed');
    setPriceInput('');
    setHours(0);
    setMinutes(30);
    setErrors({});
  };

  // Fetch categories (non-archived) for the current user when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      setCatsLoading(true);
      setCatsError(null);

      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setCatsError('You must be logged in');
        setCatsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('id,name')
        .eq('user_id', user.id)            // <-- FIXED: categories table uses user_id
        .is('deleted_at', null)
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Load categories error:', error);
        setCatsError(error.message || 'Failed to load categories');
        setCatsLoading(false);
        return;
      }

      setCategories((data ?? []).map(c => ({ id: c.id, name: c.name })));
      setCatsLoading(false);
    };

    if (open) fetchCategories();
  }, [open, supabase]);

  const handleSave = async () => {
    const parsedPrice = priceInput.trim() === '' ? undefined : Number(priceInput);
    const result = ServiceSchema.safeParse({
      name,
      description,
      categoryId,
      priceType,
      price: parsedPrice,
      hours,
      minutes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = (issue.path[0] as string) ?? 'form';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSaving(true);

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      setErrors({ form: 'You must be logged in to add a service' });
      setSaving(false);
      return;
    }

    const totalMinutes = result.data.hours * 60 + result.data.minutes;

    const { error: dbError } = await supabase
      .from('services')
      .insert([{
        profile_id: user.id,                              // services table uses profile_id
        category_id: result.data.categoryId,
        name: result.data.name,
        description: result.data.description ?? null,
        price_type: PRICE_TYPE_TO_CODE[result.data.priceType], // smallint code
        price: result.data.price ?? null,
        duration_minutes: totalMinutes,                  // adjust if your column name differs
      }]);

    if (dbError) {
      console.error(dbError);
      setErrors({ form: dbError.message || 'Error adding service' });
      setSaving(false);
      return;
    }

    resetForm();
    onOpenChange(false);
    onSuccess?.();
    setSaving(false);
  };

  const hourOptions = Array.from({ length: 10 }, (_, i) => i); // 0..9 hours
  const minuteOptions = [0, 5, 10, 15, 20, 30, 45, 50, 55];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-md bg-[#323232]">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>

        {/* Name */}
        <div>
          <label className="block text-xs mb-2">Name</label>
          <input
            className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs mb-2">Description</label>
          <textarea
            className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Category */}
        <hr className="border-[#868686]" />
        <span className="text-[70%] text-[#868686]">Category</span>
        <div className="mt-2">
          <label className="block text-xs mb-2">Select a category</label>
          <select
            className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={catsLoading || (categories.length === 0)}
          >
            <option value="">{catsLoading ? 'Loading…' : '— Select —'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {catsError && <p className="text-red-500 text-xs mt-1">{catsError}</p>}
          {(!catsLoading && categories.length === 0 && !catsError) && (
            <p className="text-xs text-[#aaa] mt-1">No categories yet. Create one first.</p>
          )}
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
        </div>

        {/* Pricing */}
        <div className="mt-4">
          <span className="text-[70%] text-[#868686]">Pricing</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-2">Price type</label>
              <select
                className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as PriceType)}
              >
                <option value="fixed">Fixed</option>
                <option value="free">Free</option>
                <option value="from">From</option>
                <option value="hourly">Hourly</option>
                <option value="hidden">Don't show while booking</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-2">Price</label>
              <input
                className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"
                inputMode="decimal"
                placeholder={priceIsRequired ? 'e.g. 49.00' : 'Optional'}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                disabled={!priceIsRequired}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>

        {/* Duration */}
        <hr className="border-[#868686]" />
        <span className="text-[70%] text-[#868686]">Duration</span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-2">Hours</label>
            <select
              className="border border-[#868686] p-2 w-full mb-4 text-xs rounded-md bg-[#3a3a3a]"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            >
              {hourOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2">Minutes</label>
            <select
              className="border border-[#868686] p-2 w-full mb-4 text-xs rounded-md bg-[#3a3a3a]"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              {minuteOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.minutes && <p className="text-red-500 text-xs -mt-3 mb-2">{errors.minutes}</p>}
          </div>
        </div>

        {errors.form && <p className="text-red-500 text-xs mb-2">{errors.form}</p>}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-xs w-16 px-2 py-1 bg-[#313131] text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
