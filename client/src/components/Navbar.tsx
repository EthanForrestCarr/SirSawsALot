import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const fetchUserStatus = async () => {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAdmin(response.data.is_admin);
        } catch (error) {
          console.error('Failed to fetch user status:', error);
          setIsLoggedIn(false);
        }
      };

      fetchUserStatus();
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to the landing page
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <h1 style={{ display: 'inline-block', marginRight: '1rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Sir Saws A Lot
        </Link>
      </h1>
      <Link to="/work-request" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
        Work Request
      </Link>
      {isLoggedIn ? (
        <>
          <Link
            to={isAdmin ? '/admin/dashboard' : '/dashboard'}
            style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link to="/profile" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Sign Out
          </button>
        </>
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
    </nav>
  );
};

export default Navbar;

/* import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/'); // Redirect to the landing page
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
      <h1 style={{ display: 'inline-block', marginRight: '1rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Sir Saws A Lot
        </Link>
      </h1>
      <Link to="/work-request" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
        Work Request
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Sign Out
          </button>
        </>
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
    </nav>
  );
};

export default Navbar; */


/* import React from 'react';
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
      <Link to="/work-request" style={{ color: '#fff', marginLeft: '1rem', textDecoration: 'none' }}>
        Work Request
      </Link>
    </nav>
  );
};

export default Navbar;
 */