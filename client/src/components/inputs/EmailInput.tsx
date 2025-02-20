import React from 'react';

interface EmailInputProps {
  formData: {
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ formData, handleChange }) => {
  return (
   
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Your email address"
        />
      </div>

  );
};

export default EmailInput;