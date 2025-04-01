import React from 'react';

interface SignOutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ children = "Sign Out", ...rest }) => {
  return (
    <button {...rest}>
      {children}
    </button>
  );
};

export default SignOutButton;
