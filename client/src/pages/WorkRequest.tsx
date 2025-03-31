import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedWorkRequestForm from '../components/forms/AuthenticatedWorkRequestForm';
import GuestWorkRequestForm from '../components/forms/GuestWorkRequestForm';
import SignupButton from '../components/buttons/SignupButton';

const WorkRequest: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data && response.data.is_admin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const showGuestForm = !token || isAdmin;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <SignupButton /> {/* New: Sign up button at the top */}
      </div>
      <h1>Work Request</h1>
      {showGuestForm ? (
        <GuestWorkRequestForm />
      ) : (
        <AuthenticatedWorkRequestForm />
      )}
    </div>
  );
};

export default WorkRequest;