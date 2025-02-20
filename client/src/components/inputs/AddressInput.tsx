import React from 'react';

interface AddressInputProps {
  formData: {
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
        placeholder="Job address"
      />
    </div>
  );
};

export default AddressInput;
