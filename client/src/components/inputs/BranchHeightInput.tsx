import React from 'react';

interface BranchHeightInputProps {
  formData: {
    branch_height: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BranchHeightInput: React.FC<BranchHeightInputProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>Branch height (feet):</label>
      <input
        type="number"
        name="branch_height"
        value={formData.branch_height}
        onChange={handleChange}
        placeholder="Approximate branch height"
      />
    </div>
  );
};

export default BranchHeightInput;
