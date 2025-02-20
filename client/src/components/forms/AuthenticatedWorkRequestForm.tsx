import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarPicker from '../CalendarPicker';
import DescriptionInput from '../inputs/DescriptionInput';
import ImageInput from '../inputs/ImageInput';
import WoodPreferenceInput from '../inputs/WoodPreferenceInput';
import StumpGrindingInput from '../inputs/StumpGrindingInput';
import BranchHeightInput from '../inputs/BranchHeightInput';
import PhoneInput from '../inputs/PhoneInput'; // Import the reusable PhoneInput component

const AuthenticatedWorkRequestForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    images: '',
    wood_keep: false,
    wood_arrangement: '',
    stump_grinding: false,
    branch_height: '',
    address: '',
    name: '',
    phone: '', // Replacing contact_info with phone
    email: '', // Add email field
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Ensure response contains user details
          if (response.data) {
            setFormData((prev) => ({
              ...prev,
              address: response.data.address || '',
              name: response.data.name || '',
              phone: response.data.phone || '', // Fetch phone number
              email: response.data.email || '', // Fetch email
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
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
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
        {/* Prefilled user info (readonly) */}
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

        <DescriptionInput formData={formData} handleChange={handleChange} />
        <ImageInput formData={formData} handleChange={handleChange} />
        <WoodPreferenceInput formData={formData} handleChange={handleChange} />
        <StumpGrindingInput formData={formData} handleChange={handleChange} />
        <BranchHeightInput formData={formData} handleChange={handleChange} />
        <CalendarPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AuthenticatedWorkRequestForm;
