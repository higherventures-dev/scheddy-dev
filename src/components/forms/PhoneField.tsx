"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type Props = {
  id?: string;
  name?: string;          // visible, formatted field (e.g., "phone")
  hiddenName?: string;    // hidden E.164 field (e.g., "phone_e164")
  defaultValue?: string;  // can be raw digits or already formatted
  required?: boolean;
};

function formatUS(input: string) {
  const d = input.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

function toE164(formatted: string) {
  const d = formatted.replace(/\D/g, "");
  return d.length ? `+1${d}` : "";
}

export default function PhoneField({
  id = "phone",
  name = "phone",
  hiddenName = "phone_e164",
  defaultValue = "",
  required,
}: Props) {
  const [val, setVal] = React.useState(formatUS(defaultValue));

  const update = (raw: string) => setVal(formatUS(raw));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update(e.target.value);
  };

  const onBeforeInput = (e: React.FormEvent<HTMLInputElement> & { data?: string }) => {
    // Block non-digits (except control keys handled by browser)
    const data = (e as any).data as string | undefined;
    if (data && /\D/.test(data)) e.preventDefault();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    update(text);
  };

  return (
    <>
      <Input
        id={id}
        name={name}
        value={val}
        onChange={onChange}
        onBeforeInput={onBeforeInput}
        onPaste={onPaste}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="(555) 555-5555"
        pattern="\(\d{3}\)\s\d{3}-\d{4}"
        aria-label="Phone number"
        required={required}
      />
      {/* Hidden normalized value for your server action */}
      <input type="hidden" name={hiddenName} value={toE164(val)} />
    </>
  );
}
