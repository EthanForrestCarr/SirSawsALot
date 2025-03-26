import React, { useState } from 'react';
import axios from 'axios';
import CurrentPasswordInput from '../inputs/CurrentPasswordInput';
import NewPasswordInput from '../inputs/NewPasswordInput';
import '../../styles/Form.css';

interface UpdatePasswordFormProps {
  onSuccess?: () => void; // Optional callback for post-update actions
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ onSuccess }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
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
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword();
  };

  return (
    <div>
      <h3>Change Password</h3>
      {message && <p>{message}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <CurrentPasswordInput value={passwordData.currentPassword} handleChange={handlePasswordChange} />
        <NewPasswordInput value={passwordData.newPassword} handleChange={handlePasswordChange} />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
