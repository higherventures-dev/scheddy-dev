// components/ui/DatePicker.tsx
'use client';

import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const DatePicker = ({ value, onChange }: Props) => {
  return (
    <div className="w-full max-w-xs mx-auto text-white text-xs mb-4">
      <label className="block mb-1">Select a date:</label>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
        dateFormat="MMMM d, yyyy"
        placeholderText="Choose a date"
      />
    </div>
  );
};

export default DatePicker;