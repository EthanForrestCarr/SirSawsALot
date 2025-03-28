import React from 'react';

interface StumpGrindingInputProps {
  formData: {
    stump_grinding: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StumpGrindingInput: React.FC<StumpGrindingInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Grind the stump?</label>
      <input
        className="checkbox-field"
        type="checkbox"
        name="stump_grinding"
        checked={formData.stump_grinding}
        onChange={handleChange}
      />
    </div>
  );
};

export default StumpGrindingInput;