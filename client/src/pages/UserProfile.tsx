import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NameInput from '../components/inputs/NameInput';
import EmailInput from '../components/inputs/EmailInput';
import PhoneInput from '../components/inputs/PhoneInput';
import AddressInput from '../components/inputs/AddressInput';
import CurrentPasswordInput from '../components/inputs/CurrentPasswordInput';
import NewPasswordInput from '../components/inputs/NewPasswordInput';

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch user information.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const saveUserInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3000/user', userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setEditMode(false);
      setMessage('User information updated successfully.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update user information.');
    }
  };

  const updatePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:3000/user/password',
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordData({ currentPassword: '', newPassword: '' });
      setMessage('Password updated successfully.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}

      {editMode ? (
        <>
          <NameInput formData={userInfo} handleChange={handleInputChange} />
          <EmailInput formData={userInfo} handleChange={handleInputChange} />
          <PhoneInput formData={userInfo} handleChange={handleInputChange} />
          <AddressInput formData={userInfo} handleChange={handleInputChange} />
          <button onClick={saveUserInfo}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Phone:</strong> {userInfo.phone}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}

      <h3>Change Password</h3>
      <CurrentPasswordInput value={passwordData.currentPassword} handleChange={handlePasswordChange} />
      <NewPasswordInput value={passwordData.newPassword} handleChange={handlePasswordChange} />
      <button onClick={updatePassword}>Update Password</button>
    </div>
  );
};

export default UserProfile;
