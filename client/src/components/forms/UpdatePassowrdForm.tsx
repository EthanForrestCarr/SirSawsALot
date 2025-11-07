import React, { useState } from 'react';
import api from '../../utils/axiosConfig';
import CurrentPasswordInput from '../inputs/CurrentPasswordInput';
import NewPasswordInput from '../inputs/NewPasswordInput';
import '../../styles/Form.css';
import SubmitButton from '../buttons/SubmitButton';

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
    try {
      await api.post('/user/password', passwordData);
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
        <SubmitButton>
          Update Password
        </SubmitButton>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
