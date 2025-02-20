import React from 'react';
import AuthenticatedWorkRequestForm from '../components/forms/AuthenticatedWorkRequestForm';
import GuestWorkRequestForm from '../components/forms/GuestWorkRequestForm';

const WorkRequest: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Work Request</h1>
      {isLoggedIn ? (
        <AuthenticatedWorkRequestForm />
      ) : (
        <GuestWorkRequestForm />
      )}
    </div>
  );
};

export default WorkRequest;