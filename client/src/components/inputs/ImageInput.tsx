import React from 'react';

interface ImageInputProps {
  formData: {
    images: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Image URLs (comma-separated):</label>
      <input
        type="text"
        name="images"
        value={formData.images}
        onChange={handleChange}
        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
      />
    </div>
  );
};

export default ImageInput;
