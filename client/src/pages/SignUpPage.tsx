import React, { useState } from 'react';
import axios from 'axios';
import NameInput from '../components/inputs/NameInput';
import EmailInput from '../components/inputs/EmailInput';
import PhoneInput from '../components/inputs/PhoneInput';
import AddressInput from '../components/inputs/AddressInput';
import NewPasswordInput from '../components/inputs/NewPasswordInput';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', formData);
      setMessage(response.data.message || 'Signup successful!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error occurred during signup.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <NameInput formData={formData} handleChange={handleChange} />
        <EmailInput formData={formData} handleChange={handleChange} />
        <NewPasswordInput value={formData.password} handleChange={handleChange} />
        <AddressInput formData={formData} handleChange={handleChange} />
        <PhoneInput formData={formData} handleChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
