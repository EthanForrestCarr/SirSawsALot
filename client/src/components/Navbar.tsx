import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <h1 style={{ margin: 0, display: 'inline-block', marginRight: '1rem' }}>
        Sir Saws A Lot
      </h1>
      <Link to="/" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
        Login
      </Link>
      <Link to="/signup" style={{ color: '#fff', marginLeft: '1rem', textDecoration: 'none' }}>
        Sign Up
      </Link>
      <Link to="/dashboard" style={{ color: '#fff', marginLeft: '1rem', textDecoration: 'none' }}>
        Dashboard
      </Link>
    </nav>
  );
};

export default Navbar;
