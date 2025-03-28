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
    <div className="input-container">
      <label className="input-label">Keep the wood?</label>
      <input
        className="checkbox-field"
        type="checkbox"
        name="wood_keep"
        checked={formData.wood_keep}
        onChange={handleChange}
      />
      {formData.wood_keep && (
        <div className="input-container">
          <label className="input-label">Wood arrangement:</label>
          <input
            className="input-field"
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
