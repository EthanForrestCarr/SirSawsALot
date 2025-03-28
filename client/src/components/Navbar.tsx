import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notifications from './buttons/Notifications';
import logo from '../assets/sirsawsalotPictures/SirSawsalotLogo.png';
import '../styles/Navbar.css';

// Define props type
interface NavbarProps {
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);

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

  const toggleDashboardDropdown = () => {
    setDashboardDropdownOpen(prev => !prev);
  };

  const handleDashboardOption = (option: string) => {
    navigate(`/dashboard?view=${option}`);
    setDashboardDropdownOpen(false);
  };

  // Dashboard options vary by user role:
  const dashboardOptions = isAdmin
    ? [
        { label: 'Requests', value: 'table' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Invoices', value: 'invoices' },
        { label: 'Messages', value: 'messages' },
        { label: 'Profile', value: 'profile' },
      ]
    : [
        { label: 'Requests', value: 'requests' },
        { label: 'Invoices', value: 'invoices' },
        { label: 'Messages', value: 'messages' },
        { label: 'Profile', value: 'profile' },
      ];

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
        {/* Removed dashboard button from here */}
      </div>

      <div className="navbar-actions">
        <div className="notifications-container">
          {isLoggedIn && <Notifications />}
        </div>
        <div className="dropdown-container">
          {isLoggedIn && (
            <div className="dropdown-wrapper">
              <button onClick={toggleDashboardDropdown} className="accordion">
                <div className={`menu-icon ${dashboardDropdownOpen ? 'change' : ''}`}>
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                </div>
              </button>
              <div 
                className="panel" 
                style={{ maxHeight: dashboardDropdownOpen ? '300px' : '0px' }}
              >
                {dashboardOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleDashboardOption(opt.value)}
                    className="dropdown-item"
                  >
                    {opt.label}
                  </button>
                ))}
                <button onClick={handleSignOut} className="dropdown-item">
                  Sign Out
                </button>
              </div>
            </div>
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