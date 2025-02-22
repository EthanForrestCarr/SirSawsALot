import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/inputs/EmailInput';
import CurrentPasswordInput from '../components/inputs/CurrentPasswordInput';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      setMessage(response.data.message || 'Login successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Redirect after successful login
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error occurred during login.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <EmailInput formData={formData} handleChange={handleChange} />
        <CurrentPasswordInput value={formData.password} handleChange={handleChange} />
        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
