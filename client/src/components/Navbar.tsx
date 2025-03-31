import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './buttons/Notifications';
import AccordionButton from './buttons/AccordionButton';
import logo from '../assets/sirsawsalotPictures/SirSawsalotLogo.png';
import '../styles/Navbar.css';

// Define props type
interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
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

  const handleDashboardOption = (option: string) => {
    navigate(`/dashboard?view=${option}`);
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1 className="navbar-brand">
          <Link to="/" className="navbar-link">
            <img src={logo} alt="Sir Sawsalot" className="navbar-logo" />
          </Link>
        </h1>
        {isLoggedIn && <Notifications />}
        <Link to="/work-request" className="navbar-link">
          Work Request
        </Link>
      </div>

      <div className="navbar-actions">
        <div className="dropdown-container">
          {isLoggedIn && (
            <AccordionButton 
              isAdmin={isAdmin}
              onSelect={handleDashboardOption} 
              onSignOut={handleSignOut} 
            />
          )}
        </div>
        {!isLoggedIn && (
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