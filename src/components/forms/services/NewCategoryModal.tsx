// components/forms/services/NewCategoryModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().optional(),
});

export interface CategoryBasics {
  id: string;
  name: string;
  description?: string | null;
}

export default function NewCategoryModal({
  open,
  onClose,
  onSuccess,
  category,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: CategoryBasics | null;   // ✅ if present => edit
}) {
  const supabase = createClient();
  const isEdit = !!category;

  const [name, setName] = useState('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && isEdit && category) {
      setName(category.name ?? '');
      setDescription(category.description ?? '');
      setError(null);
    }
    if (open && !isEdit) {
      setName('');
      setDescription('');
      setError(null);
    }
  }, [open, isEdit, category]);

  const reset = () => { setName(''); setDescription(''); setError(null); setSaving(false); };

  const handleSave = async () => {
    const result = CategorySchema.safeParse({ name, description });
    if (!result.success) { setError(result.error.errors[0].message); return; }

    setError(null);
    setSaving(true);

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) { setError('You must be logged in to save a category'); setSaving(false); return; }

    if (isEdit && category) {
      const { error: dbError } = await supabase
        .from('categories')
        .update({ name: result.data.name, description: result.data.description ?? null })
        .eq('id', category.id);
      if (dbError) { setError(dbError.message ?? 'Error updating category'); setSaving(false); return; }
    } else {
      const { error: dbError } = await supabase
        .from('categories')
        .insert([{ name: result.data.name, description: result.data.description ?? null, user_id: user.id }]);
      if (dbError) { setError(dbError.message ?? 'Error adding category'); setSaving(false); return; }
    }

    reset();
    onSuccess?.();   // parent closes + refreshes
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle><h3 className="text-sm">{isEdit ? 'Edit Category' : 'Add Category'}</h3></DialogTitle>
        </DialogHeader>

        <label className="text-xs mb-0 pb-0">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border w-full mb-1 rounded-md text-xs p-2" placeholder="Name" />

        <label className="text-xs mb-0 pb-0">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="border w-full mb-1 rounded-md text-xs p-2" placeholder="Description (optional)" />

        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <Button onClick={handleSave} disabled={saving} className="text-xs w-24 px-2 py-1 bg-[#313131] text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Save')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
