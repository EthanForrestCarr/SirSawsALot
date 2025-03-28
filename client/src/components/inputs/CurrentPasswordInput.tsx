import React from 'react';

interface CurrentPasswordInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CurrentPasswordInput: React.FC<CurrentPasswordInputProps> = ({ value, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Current Password:</label>
      <input
        className="input-field"
        type="password"
        name="password"
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default CurrentPasswordInput;
