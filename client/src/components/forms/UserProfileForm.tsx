import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import PhoneInput from '../inputs/PhoneInput';
import AddressInput from '../inputs/AddressInput';

interface UserProfileFormProps {
  onSuccess?: () => void; // Optional callback for after successful update
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSuccess }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
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

  const saveUserInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3000/user', userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setEditMode(false);
      setMessage('User information updated successfully.');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update user information.');
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default UserProfileForm;
