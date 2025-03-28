import React from 'react';

interface ImageInputProps {
  formData: {
    imageFile: File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Upload an image of the tree:</label>
      <input
        className="input-field"
        type="file"
        name="imageFile"
        onChange={handleChange}
        accept="image/*"
      />
      {formData.imageFile && <p>{formData.imageFile.name}</p>}
    </div>
  );
};

export default ImageInput;
