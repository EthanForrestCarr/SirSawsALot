import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/login')} className="navbar-button">
      Login
    </button>
  );
};

export default LoginButton;
