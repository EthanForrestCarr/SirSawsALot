import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import logo from '../assets/sirsawsalotPictures/SirSawsalotLogo.png';

// Define props type
interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Navigate to home page
    window.location.reload(); // Refresh the page
  };

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ display: 'inline-block', marginRight: '1rem' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            <img src={logo} alt="Sir Sawsalot" style={{ height: '100px' }} />
          </Link>
        </h1>
        <Link to="/work-request" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
          Work Request
        </Link>
        {isLoggedIn && (
          <>
            <Link to='/dashboard' style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/profile" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
              Profile
            </Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isLoggedIn && <Notifications />}
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', textDecoration: 'none', marginLeft: '1rem' }}
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;