import React from 'react';
import UpdatePasswordForm from '../components/forms/UpdatePassowrdForm';
import UserProfileForm from '../components/forms/UserProfileForm';

const UserProfile: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <UserProfileForm />
      <UpdatePasswordForm />
    </div>
  );
};

export default UserProfile;
