import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthenticatedWorkRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    description: '',
    images: '',
    wood_keep: false,
    wood_arrangement: '',
    stump_grinding: false,
    branch_height: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Prefill user details
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData((prev) => ({
          ...prev,
          address: response.data.address || '',
          name: response.data.name || '',
          contact_info: response.data.contact_info || '',
        }));
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked, // Use checked for checkboxes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value, // Use value for text inputs and textareas
      });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const data = {
        ...formData,
        branch_height: parseInt(formData.branch_height, 10),
        images: formData.images.split(',').map((url) => url.trim()), // Convert images to array
      };
      const response = await axios.post('http://localhost:3000/requests', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message || 'Work request submitted successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting work request.');
    }
  };

  return (
    <div>
      <h2>Authenticated Work Request Form</h2>
      <form onSubmit={handleSubmit}>
        <textarea name="description" placeholder="Job description" required onChange={handleChange} />
        <input type="text" name="images" placeholder="Image URLs (comma-separated)" onChange={handleChange} />
        <input type="checkbox" name="wood_keep" onChange={handleChange} />
        <input type="text" name="wood_arrangement" placeholder="How to arrange wood" onChange={handleChange} />
        <input type="checkbox" name="stump_grinding" onChange={handleChange} />
        <input type="number" name="branch_height" placeholder="Branch height (feet)" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthenticatedWorkRequestForm;
