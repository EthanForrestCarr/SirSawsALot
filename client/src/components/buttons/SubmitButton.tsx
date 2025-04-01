import React from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, type = "submit", ...rest }) => {
  return (
    <button type={type} {...rest}>
      {children}
    </button>
  );
};

export default SubmitButton;
