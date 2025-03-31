import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/signup')} className="navbar-button">
      Sign Up
    </button>
  );
};

export default SignupButton;
