import React from 'react';

interface StumpGrindingInputProps {
  formData: {
    stump_grinding: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StumpGrindingInput: React.FC<StumpGrindingInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Grind the stump?</label>
      <input
        type="checkbox"
        name="stump_grinding"
        checked={formData.stump_grinding}
        onChange={handleChange}
      />
    </div>
  );
};

export default StumpGrindingInput;