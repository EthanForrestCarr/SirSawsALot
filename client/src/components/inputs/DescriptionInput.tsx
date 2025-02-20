import React from 'react';

interface DescriptionInputProps {
  formData: {
    description: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        placeholder="Job description"
      />
    </div>
  );
};

export default DescriptionInput;
