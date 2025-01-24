import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={userInfo.address}
              onChange={handleInputChange}
            />
          </div>
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
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />
      </div>
      <button onClick={updatePassword}>Update Password</button>
    </div>
  );
};

export default UserProfile;
