import React from 'react';

interface CurrentPasswordInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CurrentPasswordInput: React.FC<CurrentPasswordInputProps> = ({ value, handleChange }) => {
  return (
    <div>
      <label>Current Password:</label>
      <input
        type="password"
        name="currentPassword"
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default CurrentPasswordInput;
