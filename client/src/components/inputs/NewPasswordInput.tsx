import React from 'react';

interface NewPasswordInputProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewPasswordInput: React.FC<NewPasswordInputProps> = ({ value, handleChange }) => {
  return (
    <div>
      <label>New Password:</label>
      <input
        type="password"
        name="newPassword"
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default NewPasswordInput;
