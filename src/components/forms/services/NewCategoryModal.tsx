'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function NewCategoryModal({ open, onOpenChange }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const supabase = createClient();

  const handleSave = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to add a category');
      return;
    }

    // Insert new category
    const { error } = await supabase
      .from('categories')
      .insert([
        {
          name,
          user_id: user.id,
        }
      ]);

    if (error) {
      console.error(error);
      alert('Error adding category');
    } else {
      // Reset form
      setName('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-sm">Add Category</h1>
          </DialogTitle>
        </DialogHeader>

        <span className="text-xs mb-0 pb-0">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full mb-4 rounded-md text-xs p-2"
          placeholder="Name"
        />

        <Button
          onClick={handleSave}
          className="text-xs w-16 px-2 py-1 bg-[#313131] text-white rounded-md hover:bg-blue-700"
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
