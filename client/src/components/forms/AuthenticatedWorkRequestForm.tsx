import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateInput from '../inputs/DateInput';
import DescriptionInput from '../inputs/DescriptionInput';
import ImageInput from '../inputs/ImageInput';
import WoodPreferenceInput from '../inputs/WoodPreferenceInput';
import StumpGrindingInput from '../inputs/StumpGrindingInput';
import BranchHeightInput from '../inputs/BranchHeightInput';
import PhoneInput from '../inputs/PhoneInput';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import AddressInput from '../inputs/AddressInput';
import SubmitButton from '../buttons/SubmitButton';
import '../../styles/Form.css';

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
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    imageFile: null as File | null, // Add imageFile property
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
              firstName: response.data.first_name || '',
              lastName: response.data.last_name || '',
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
    const { name } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setFormData({
        ...formData,
        imageFile: e.target.files ? e.target.files[0] : null, // Handle file input
      });
    } else if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === 'imageFile' && formData.imageFile) {
          payload.append('imageFile', formData.imageFile); // Append file to FormData
        } else {
          payload.append(key, (formData as any)[key]);
        }
      }
      payload.append('date', selectedDate);

      const response = await axios.post('http://localhost:3000/requests', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'Work request submitted successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting work request.');
    }
  };

  return (
    <div>
      <h2>Authenticated Work Request Form</h2>
      <form className="form" onSubmit={handleSubmit}>
        <NameInput formData={formData} handleChange={handleChange} />
        <EmailInput formData={formData} handleChange={handleChange} />
        <AddressInput formData={formData} handleChange={handleChange} />
        <PhoneInput formData={formData} handleChange={handleChange} />
        <DateInput selectedDate={selectedDate} onDateChange={setSelectedDate} required />
        <DescriptionInput formData={formData} handleChange={handleChange} />
        <ImageInput formData={formData} handleChange={handleChange} />
        <WoodPreferenceInput formData={formData} handleChange={handleChange} />
        <StumpGrindingInput formData={formData} handleChange={handleChange} />
        <BranchHeightInput formData={formData} handleChange={handleChange} />

        <SubmitButton>
          Submit
        </SubmitButton>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthenticatedWorkRequestForm;