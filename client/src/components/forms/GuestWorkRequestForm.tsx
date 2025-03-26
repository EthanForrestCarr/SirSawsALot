import React, { useState } from 'react';
import axios from 'axios';
import NameInput from '../inputs/NameInput';
import EmailInput from '../inputs/EmailInput';
import PhoneInput from '../inputs/PhoneInput';
import DescriptionInput from '../inputs/DescriptionInput';
import AddressInput from '../inputs/AddressInput';
import ImageInput from '../inputs/ImageInput';
import WoodPreferenceInput from '../inputs/WoodPreferenceInput';
import StumpGrindingInput from '../inputs/StumpGrindingInput';
import BranchHeightInput from '../inputs/BranchHeightInput';
import DateInput from '../inputs/DateInput';
import '../../styles/Form.css';

const GuestWorkRequestForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    imageFile: null as File | null, // Updated to handle file
    wood_keep: false,
    wood_arrangement: '',
    stump_grinding: false,
    branch_height: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setFormData({
        ...formData,
        imageFile: e.target.files ? e.target.files[0] : null,
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
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === 'imageFile' && formData.imageFile) {
          payload.append('imageFile', formData.imageFile);
        } else {
          payload.append(key, (formData as any)[key]);
        }
      }
      payload.append('date', selectedDate);

      const response = await axios.post('http://localhost:3000/requests/guest', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message || 'Work request submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        description: '',
        address: '',
        imageFile: null,
        wood_keep: false,
        wood_arrangement: '',
        stump_grinding: false,
        branch_height: '',
      });
      setSelectedDate('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting work request.');
    }
  };

  return (
    <div>
      <h2>Guest Work Request Form</h2>
      <form className="form" onSubmit={handleSubmit}>
        <NameInput formData={formData} handleChange={handleChange} />
        <EmailInput formData={formData} handleChange={handleChange} />
        <PhoneInput formData={formData} handleChange={handleChange} />
        <DescriptionInput formData={formData} handleChange={handleChange} />
        <AddressInput formData={formData} handleChange={handleChange} />
        <ImageInput formData={formData} handleChange={handleChange} />
        <WoodPreferenceInput formData={formData} handleChange={handleChange} />
        <StumpGrindingInput formData={formData} handleChange={handleChange} />
        <BranchHeightInput formData={formData} handleChange={handleChange} />
        <DateInput selectedDate={selectedDate} onDateChange={setSelectedDate} required />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GuestWorkRequestForm;
