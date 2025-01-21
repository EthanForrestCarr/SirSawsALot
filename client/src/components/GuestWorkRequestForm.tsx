import React, { useState } from 'react';
import axios from 'axios';

const GuestWorkRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    images: '',
    wood_keep: false,
    wood_arrangement: '',
    stump_grinding: false,
    branch_height: '',
  });

  const [message, setMessage] = useState('');

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
    try {
      const data = {
        ...formData,
        branch_height: parseInt(formData.branch_height, 10) || null,
        images: formData.images.split(',').map((url) => url.trim()), // Convert images to array
      };

      const response = await axios.post('http://localhost:3000/requests', data);
      setMessage(response.data.message || 'Work request submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        description: '',
        address: '',
        images: '',
        wood_keep: false,
        wood_arrangement: '',
        stump_grinding: false,
        branch_height: '',
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error submitting work request.');
    }
  };

  return (
    <div>
      <h2>Guest Work Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your email address"
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Your phone number"
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Job description"
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
            placeholder="Job address"
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
          />
        </div>
        <div>
          <label>Keep the wood?</label>
          <input
            type="checkbox"
            name="wood_keep"
            checked={formData.wood_keep}
            onChange={handleChange}
          />
        </div>
        {formData.wood_keep && (
          <div>
            <label>Wood arrangement:</label>
            <input
              type="text"
              name="wood_arrangement"
              value={formData.wood_arrangement}
              onChange={handleChange}
              placeholder="How should the wood be stacked/arranged?"
            />
          </div>
        )}
        <div>
          <label>Grind the stump?</label>
          <input
            type="checkbox"
            name="stump_grinding"
            checked={formData.stump_grinding}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Branch height (feet):</label>
          <input
            type="number"
            name="branch_height"
            value={formData.branch_height}
            onChange={handleChange}
            placeholder="Approximate branch height"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GuestWorkRequestForm;