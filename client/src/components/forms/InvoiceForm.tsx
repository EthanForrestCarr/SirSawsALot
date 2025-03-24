import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';

export interface InvoiceFormData {
  request_id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  wood_keep: boolean;           // true means free, false costs $50.00
  stump_grinding: boolean;      // true costs $100.00, false is free
  service_type: string;         // "Just a trim"|"Branch Removal"|"Full Tree Service"
  job_scope: string;            // "small" | "medium" | "large" (affects service price)
  discount: number;             // discount percentage to be applied
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
    wood_keep: false,
    stump_grinding: false,
    service_type: '', // changed default to empty
    job_scope: '',    // changed default to empty
    discount: 0,
    total_amount: '',
    due_date: '',
    notes: '',
  });

  // If initial data is provided, update state accordingly.
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Helper function to calculate the total based on the given criteria.
  const calculateTotal = (data: InvoiceFormData): string => {
    // Wood Keep: true is free; false costs $50
    const woodKeepPrice = data.wood_keep ? 0 : 50;
    // Stump Grinding: if true then $100, else 0
    const stumpPrice = data.stump_grinding ? 100 : 0;

    // Service type base price
    let baseServicePrice = 0;
    switch (data.service_type) {
      case "Just a trim":
        baseServicePrice = 100;
        break;
      case "Branch Removal":
        baseServicePrice = 200;
        break;
      case "Full Tree Service":
        baseServicePrice = 400;
        break;
      default:
        baseServicePrice = 0; // if placeholder/not selected
    }
    // Job scope adjustment (medium is baseline)
    let scopeAdjustment = 0;
    if (data.job_scope === "small") {
      scopeAdjustment = -50;
    } else if (data.job_scope === "large") {
      scopeAdjustment = 50;
    }
    const servicePrice = baseServicePrice + scopeAdjustment;
    // Sum before discount
    const subtotal = woodKeepPrice + stumpPrice + servicePrice;
    // Calculate discount percentage (if any)
    const discountPercent = data.discount || 0;
    const total = subtotal * (1 - discountPercent / 100);
    return total.toFixed(2);
  };

  // Update form state and recalc the total each time one of the inputs change.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean | number = value;
    // Handle booleans for wood_keep and stump_grinding.
    if (name === "wood_keep" || name === "stump_grinding") {
      newValue = value === "true";
    }
    // Handle discount as number.
    if (name === "discount") {
      newValue = parseFloat(value) || 0;
    }

    setFormData((prev) => {
      // Create new object with the changed field.
      const updatedData = { ...prev, [name]: newValue } as InvoiceFormData;
      // Re-calc the total amount
      updatedData.total_amount = calculateTotal(updatedData);
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/admin/invoices', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      onUpdate();
      // Optionally clear the form after submission.
      setFormData({
        request_id: '',
        customer_first_name: '',
        customer_last_name: '',
        customer_email: '',
        customer_phone: '',
        address: '',
        wood_keep: false,
        stump_grinding: false,
        service_type: '', // reset to empty
        job_scope: '',    // reset to empty
        discount: 0,
        total_amount: '',
        due_date: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      {/* Display-only customer information with improved spacing and alignment */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>Work Request ID:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.request_id}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>First Name:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.customer_first_name}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>Last Name:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.customer_last_name}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>Email:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.customer_email}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>Phone:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.customer_phone}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ width: '40%' }}>Address:</label>
        <span style={{ width: '60%', textAlign: 'right' }}>{formData.address}</span>
      </div>
      <br />
      {/* Editable fields with alignment */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Wood Keep:</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <select name="wood_keep" value={formData.wood_keep ? "true" : "false"} onChange={handleChange} required>
            <option value="true">Yes (Free)</option>
            <option value="false">No ($50.00)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Stump Grinding:</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <select name="stump_grinding" value={formData.stump_grinding ? "true" : "false"} onChange={handleChange} required>
            <option value="true">Yes ($100.00)</option>
            <option value="false">No (Free)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Service Type:</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <select name="service_type" value={formData.service_type} onChange={handleChange} required>
            <option value="" disabled>Select Service Type</option>
            <option value="Just a trim">Just a trim ($100.00 baseline)</option>
            <option value="Branch Removal">Branch Removal ($200.00 baseline)</option>
            <option value="Full Tree Service">Full Tree Service ($400.00 baseline)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Job Scope:</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <select name="job_scope" value={formData.job_scope} onChange={handleChange} required>
            <option value="" disabled>Select Job Scope</option>
            <option value="small">Small (Subtract $50)</option>
            <option value="medium">Medium (No change)</option>
            <option value="large">Large (Add $50)</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Discount (%):</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <input
            type="number"
            name="discount"
            placeholder="Discount percentage"
            onChange={handleChange}
            value={formData.discount}
            min="0"
            max="100"
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <label style={{ width: '40%' }}>Due Date:</label>
        <div style={{ width: '60%', textAlign: 'right' }}>
          <input
            name="due_date"
            type="date"
            onChange={handleChange}
            value={formData.due_date}
            required
          />
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes:</label>
        <TextareaAutosize
          name="notes"
          placeholder="Notes"
          onChange={handleChange}
          value={formData.notes}
          minRows={3}
          style={{ width: '100%', resize: 'none' }} // deactivated resizing altogether
        />
      </div>
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <div>
          <strong>Total: ${formData.total_amount}</strong>
        </div>
        <br />
        <button type="submit">Create Invoice</button>
      </div>
    </form>
  );
};

export default InvoiceForm;
