import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import PhoneInput from '../inputs/PhoneInput';
import AddressInput from '../inputs/AddressInput';
import '../../styles/Form.css';
import CancelButton from '../buttons/CancelButton';

interface UserProfileFormProps {
  onSuccess?: () => void; // Optional callback for after successful update
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSuccess }) => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
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
        setUserInfo({
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        });
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
      // Convert camelCase to snake_case when sending data
      const payload = {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
      };
      const response = await axios.put('http://localhost:3000/user', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({
        firstName: response.data.first_name || '',
        lastName: response.data.last_name || '',
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
      });
      setEditMode(false);
      setMessage('User information updated successfully.');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update user information.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserInfo();
  };

  return (
    <div>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}

      {editMode ? (
        <form className="form" onSubmit={handleSubmit}>
          <NameInput formData={userInfo} handleChange={handleInputChange} />
          <EmailInput formData={userInfo} handleChange={handleInputChange} />
          <PhoneInput formData={userInfo} handleChange={handleInputChange} />
          <AddressInput formData={userInfo} handleChange={handleInputChange} />
          <button type="submit">Save</button>
          <CancelButton type="button" onClick={() => setEditMode(false)}>
            Cancel
          </CancelButton>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
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
