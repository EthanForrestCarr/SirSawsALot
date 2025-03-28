import React from 'react';

interface NewPasswordInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewPasswordInput: React.FC<NewPasswordInputProps> = ({ value, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">New Password:</label>
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

export default NewPasswordInput;
