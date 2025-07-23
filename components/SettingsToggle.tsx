// components/SettingsToggle.tsx
'use client';

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import clsx from "clsx"; 

type SettingsToggleProps = {
  label: string;
  description?: React.ReactNode;
  value?: boolean;
  onChange?: (value: boolean) => void;
  bordered?: boolean;
};

export function SettingsToggle({ label, description, value = false, onChange, bordered=true}: SettingsToggleProps) {
  const [enabled, setEnabled] = useState(value);

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    onChange?.(val);
  };

  return (
    <div  className={clsx(
        "rounded-lg px-4 py-3 flex justify-between items-center",
        bordered && "border border-[#313131]"
      )}>
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <Switch checked={enabled} onCheckedChange={handleToggle} className="data-[state=checked]:bg-[#69AADE] after:bg-white"/>
    </div>
  );
}