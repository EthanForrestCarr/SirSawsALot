import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface InvoiceFormData {
  request_id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  customer_description: string; // renamed field
  services: string;            // new field for services
  total_amount: string;
  due_date: string;
  notes: string;
}

interface InvoiceFormProps {
  onUpdate: () => void;
  initialData?: InvoiceFormData;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onUpdate, initialData }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    request_id: '',
    customer_first_name: '',
    customer_last_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    customer_description: '', // updated field
    services: '',             // new field
    total_amount: '',
    due_date: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/admin/invoices', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      onUpdate();
      // Optionally clear the form after submission:
      setFormData({
        request_id: '',
        customer_first_name: '',
        customer_last_name: '',
        customer_email: '',
        customer_phone: '',
        address: '',
        customer_description: '', // updated field
        services: '',             // new field
        total_amount: '',
        due_date: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="request_id"
        type="number"
        placeholder="Work Request ID"
        onChange={handleChange}
        value={formData.request_id}
        required
      />
      <input
        name="customer_first_name"
        type="text"
        placeholder="Customer First Name"
        onChange={handleChange}
        value={formData.customer_first_name}
        required
      />
      <input
        name="customer_last_name"
        type="text"
        placeholder="Customer Last Name"
        onChange={handleChange}
        value={formData.customer_last_name}
        required
      />
      <input
        name="customer_email"
        type="email"
        placeholder="Customer Email"
        onChange={handleChange}
        value={formData.customer_email}
        required
      />
      <input
        name="customer_phone"
        type="text"
        placeholder="Customer Phone"
        onChange={handleChange}
        value={formData.customer_phone}
        required
      />
      <input
        name="address"
        type="text"
        placeholder="Address"
        onChange={handleChange}
        value={formData.address}
        required
      />
      <textarea
        name="customer_description"
        placeholder="Customer Description" // updated label
        onChange={handleChange}
        value={formData.customer_description}
        required
      />
      <textarea
        name="services"
        placeholder="Services (e.g., Wood Keep: Yes, Stump Grinding: No)" // new field
        onChange={handleChange}
        value={formData.services}
        required
      />
      <input
        name="total_amount"
        type="number"
        placeholder="Total Amount"
        onChange={handleChange}
        value={formData.total_amount}
        required
      />
      <input
        name="due_date"
        type="date"
        onChange={handleChange}
        value={formData.due_date}
        required
      />
      <textarea
        name="notes"
        placeholder="Notes"
        onChange={handleChange}
        value={formData.notes}
      />
      <button type="submit">Create Invoice</button>
    </form>
  );
};

export default InvoiceForm;
