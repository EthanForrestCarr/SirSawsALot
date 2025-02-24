import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateInput from '../inputs/DateInput';
import DescriptionInput from '../inputs/DescriptionInput';
import ImageInput from '../inputs/ImageInput';
import WoodPreferenceInput from '../inputs/WoodPreferenceInput';
import StumpGrindingInput from '../inputs/StumpGrindingInput';
import BranchHeightInput from '../inputs/BranchHeightInput';
import PhoneInput from '../inputs/PhoneInput';

const AuthenticatedWorkRequestForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    images: '',
    wood_keep: false,
    wood_arrangement: '',
    stump_grinding: false,
    branch_height: '',
    address: '',
    name: '',
    phone: '',
    email: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data) {
            setFormData((prev) => ({
              ...prev,
              address: response.data.address || '',
              name: response.data.name || '',
              phone: response.data.phone || '',
              email: response.data.email || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const data = {
        ...formData,
        branch_height: parseInt(formData.branch_height, 10),
        images: formData.images.split(',').map((url) => url.trim()),
        date: selectedDate, // Add the selected date to the data
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
        <div>
          <label>Name:</label>
          <input type="text" value={formData.name} readOnly />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={formData.email} readOnly />
        </div>
        <PhoneInput formData={formData} handleChange={handleChange} />
        <div>
          <label>Address:</label>
          <input type="text" value={formData.address} readOnly />
        </div>

        <DateInput value={selectedDate} onChange={handleDateChange} required />
        <DescriptionInput formData={formData} handleChange={handleChange} />
        <ImageInput formData={formData} handleChange={handleChange} />
        <WoodPreferenceInput formData={formData} handleChange={handleChange} />
        <StumpGrindingInput formData={formData} handleChange={handleChange} />
        <BranchHeightInput formData={formData} handleChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthenticatedWorkRequestForm;