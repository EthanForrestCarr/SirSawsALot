import React from 'react';

interface DescriptionInputProps {
  formData: {
    description: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Description:</label>
      <textarea
        className="textarea-field"
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
