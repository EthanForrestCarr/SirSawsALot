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
      <>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="Your first name"
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Your last name"
        />
      </>
  );
};

export default NameInput;
