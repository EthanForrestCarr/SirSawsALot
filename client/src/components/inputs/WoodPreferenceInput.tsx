import React from 'react';

interface WoodPreferenceInputProps {
  formData: {
    wood_keep: boolean;
    wood_arrangement: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WoodPreferenceInput: React.FC<WoodPreferenceInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Keep the wood?</label>
      <input
        type="checkbox"
        name="wood_keep"
        checked={formData.wood_keep}
        onChange={handleChange}
      />
      {formData.wood_keep && (
        <div>
          <label>Wood arrangement:</label>
          <input
            type="text"
            name="wood_arrangement"
            value={formData.wood_arrangement}
            onChange={handleChange}
            placeholder="How should the wood be stacked/arranged?"
          />
        </div>
      )}
    </div>
  );
};

export default WoodPreferenceInput;
