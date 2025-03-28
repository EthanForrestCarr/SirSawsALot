import React from 'react';

interface NameInputProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput: React.FC<NameInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">First Name:</label>
      <input
        className="input-field"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        placeholder="Your first name"
      />
      <label className="input-label">Last Name:</label>
      <input
        className="input-field"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        placeholder="Your last name"
      />
    </div>
  );
};

export default NameInput;
