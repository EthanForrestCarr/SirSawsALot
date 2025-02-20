import React from 'react';

interface PhoneInputProps {
  formData: {
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ formData, handleChange }) => {
  return (
      <>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Your phone number"
        />
      </>
  );
};

export default PhoneInput;