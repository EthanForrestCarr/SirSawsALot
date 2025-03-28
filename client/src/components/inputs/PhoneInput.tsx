import React from 'react';

interface PhoneInputProps {
  formData: {
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Phone:</label>
      <input
        className="input-field"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="Your phone number"
      />
    </div>
  );
};

export default PhoneInput;