import React from 'react';

interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, required = false }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      required={required}
    />
  );
};

export default DateInput;