// src/components/services/SortableCategoryCard.tsx
'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type Category = {
  id: string;
  name: string;
  description?: string | null;
  deleted_at?: string | null;
};

export default function SortableCategoryCard({
  category,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
  canDelete,
  busy,
}: {
  category: Category;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onEdit: () => void;
  canDelete: boolean;
  busy: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const isArchived = !!category.deleted_at;

  // Delete confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmText('');
  };
  const handleConfirmDelete = () => {
    onDelete();
    closeConfirm();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-3 rounded-md border border-[#444] bg-[#2d2d2d] p-3"
    >
      {/* Left: dotted drag handle + text content */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Dotted drag handle (visible, subtle, not next to the text) */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag handle"
          className="cursor-grab select-none shrink-0 w-6 h-10 rounded"
          style={{
            // subtle dot grid
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1.6px)',
            backgroundSize: '6px 6px',
            color: '#8a8a8a',
            opacity: 0.75,
          }}
          title="Drag to reorder"
        />

        {/* Name on top, description beneath */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium">{category.name}</div>
            {isArchived && (
              <span className="shrink-0 rounded bg-[#555] px-2 py-[2px] text-[10px] text-white">
                Archived
              </span>
            )}
          </div>

          {category.description ? (
            <div className="truncate text-[11px] text-[#aaa]">
              {category.description}
            </div>
          ) : null}
        </div>
      </div>

      {/* Right: actions */}
      <div className="shrink-0 flex items-center gap-2">
        <Button
          disabled={busy}
          onClick={onEdit}
          className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
        >
          Edit
        </Button>

        {!isArchived ? (
          <Button
            disabled={busy}
            onClick={onArchive}
            className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
          >
            Archive
          </Button>
        ) : (
          <Button
            disabled={busy}
            onClick={onUnarchive}
            className="text-xs bg-[#3A3A3A] text-white px-3 py-1"
          >
            Unarchive
          </Button>
        )}

        {canDelete && (
          <>
            <Button
              disabled={busy}
              onClick={() => setConfirmOpen(true)}
              className="text-xs bg-red-600 text-white px-3 py-1 hover:bg-red-700"
            >
              Delete
            </Button>

            {/* Confirmation dialog */}
            <Dialog
              open={confirmOpen}
              onOpenChange={(o) => (o ? setConfirmOpen(true) : closeConfirm())}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete “{category.name}”?</DialogTitle>
                  <DialogDescription>
                    This will permanently remove this category. This action cannot be undone.
                    <span className="mt-2 block">
                      Type <b>{category.name}</b> to confirm:
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <input
                  autoFocus
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="mt-3 w-full rounded-md border border-[#666] bg-[#2f2f2f] p-2 text-sm outline-none"
                  placeholder={category.name}
                />

                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={closeConfirm}
                    disabled={busy}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    disabled={busy || confirmText !== category.name}
                    className="text-xs bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
