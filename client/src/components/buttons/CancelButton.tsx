import React from 'react';

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const CancelButton: React.FC<CancelButtonProps> = ({ children = "Cancel", ...rest }) => {
  return (
    <button {...rest}>
      {children}
    </button>
  );
};

export default CancelButton;
