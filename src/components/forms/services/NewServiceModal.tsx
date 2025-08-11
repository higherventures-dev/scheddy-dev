'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function NewServiceModal({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#323232]">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>
        {/* Form fields */}
        <div>
        <label className="block text-xs mb-2">Name</label>
        <input className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]" placeholder=""/>
        </div>
        <div>
        <label className="block text-xs mb-2">Description</label>
        <textarea className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]" placeholder=""/>
        </div>
        <hr className="border-[#868686]"/>
        <span className="text-[70%] text-[#868686]">Categories</span>
        <div>
            <span className="text-[70%] text-[#868686]">Pricing</span>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs mb-2">Price type</label>
                    <select  className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]">
                        <option value="1">Fixed</option>
                        <option value="2">Free</option>
                        <option value="3">From</option>
                        <option value="4">Hourly</option>
                        <option value="5">Don't show while booking</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs mb-2">Price</label>
                    <input className="border border-[#868686] p-2 w-full text-xs rounded-md bg-[#3a3a3a]"></input>
                </div>
            </div>
        </div>
        <hr className="border-[#868686]"/>
        <span className="text-[70%] text-[#868686]">Duration</span>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs mb-2">Hours</label>
                <select className="border border-[#868686] p-2 w-full mb-4 text-xs rounded-md bg-[#3a3a3a]"></select>
            </div>
            <div>
                <label className="block text-xs mb-2">Minutes</label>
                <select className="border border-[#868686] p-2 w-full mb-4 text-xs rounded-md bg-[#3a3a3a]"></select>
            </div>
        </div>
        <Button onClick={() => onOpenChange(false)} 
            className="text-xs w-16 px-2 py-1 bg-[#313131] text-white rounded-md hover:bg-blue-700">Save</Button>
      </DialogContent>
    </Dialog>
  );
}
