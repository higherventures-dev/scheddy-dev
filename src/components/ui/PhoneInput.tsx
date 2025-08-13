import React, { useState } from 'react';

const PhoneInput: React.FC = () => {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const length = digits.length;

    if (length <= 3) return digits;
    if (length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, '');

    setRawValue(digits); // Store only numbers for saving
    setDisplayValue(formatPhoneNumber(input)); // Format for display
  };

  const handleSubmit = () => {
    console.log('Saving raw phone number:', rawValue); // This is what you'd send to the DB
  };

  return (
    <div>
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="(123) 456-7890"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PhoneInput;