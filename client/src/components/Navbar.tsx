import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './buttons/Notifications';
import AccordionButton from './buttons/AccordionButton';
import logo from '../assets/sirsawsalotPictures/SirSawsalotLogo.png';
import '../styles/Navbar.css';
import LoginButton from './buttons/LoginButton';

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
            <LoginButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;