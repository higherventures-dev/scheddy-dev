"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function NewServiceDialog({ open, onClose, onSave, categoryId }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new service</DialogTitle>
        </DialogHeader>
        <Input placeholder="Service name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
        <Input placeholder="Duration (min)" value={duration} onChange={(e) => setDuration(e.target.value)} type="number" />
        <DialogFooter>
          <Button
            onClick={() => {
              onSave({ name, price: parseFloat(price), duration: parseInt(duration), categoryId });
              setName(""); setPrice(""); setDuration(""); onClose();
            }}
          >Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}