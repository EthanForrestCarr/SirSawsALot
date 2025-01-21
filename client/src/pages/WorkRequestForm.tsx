import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    images: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Prefill the address if the user is logged in
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFormData((prevData) => ({
            ...prevData,
            address: response.data.address || '',
          }));
        } catch {
          console.warn('Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const data = {
        ...formData,
        images: formData.images.split(',').map((url) => url.trim()), // Convert image URLs to an array
      };

      const response = await axios.post('http://localhost:3000/requests', data, { headers });
      setMessage('Work request submitted successfully!');
      setFormData({ description: '', address: '', images: '' }); // Reset form
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting work request.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Submit a Work Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', height: '80px', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <label>Image URLs (comma-separated):</label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default WorkRequestForm;