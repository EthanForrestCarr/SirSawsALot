import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './buttons/Notifications';
import logo from '../assets/sirsawsalotPictures/SirSawsalotLogo.png';
import '../styles/Navbar.css';

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
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div>
        <h1 className="navbar-brand">
          <Link to="/" className="navbar-link">
            <img src={logo} alt="Sir Sawsalot" className="navbar-logo" />
          </Link>
        </h1>
        <Link to="/work-request" className="navbar-link">
          Work Request
        </Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            {/* Removed Profile link */}
          </>
        )}
      </div>

      <div className="navbar-actions">
        {isLoggedIn && <Notifications />}
        {isLoggedIn ? (
          <button onClick={handleSignOut} className="navbar-button">
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;