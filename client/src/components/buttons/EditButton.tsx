import React from 'react';

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const EditButton: React.FC<EditButtonProps> = ({ children = "Edit", ...rest }) => {
  return (
    <button {...rest}>
      {children}
    </button>
  );
};

export default EditButton;
