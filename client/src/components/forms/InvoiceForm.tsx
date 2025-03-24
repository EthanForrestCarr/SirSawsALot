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
    customer_description: '',
    wood_keep: false,
    stump_grinding: false,
    service_type: 'Just a trim',
    job_scope: 'medium',
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
        baseServicePrice = 0;
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
        customer_description: '',
        wood_keep: false,
        stump_grinding: false,
        service_type: 'Just a trim',
        job_scope: 'medium',
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
      {/* Non-editable customer description */}
      <div>
        <label>Customer Description:</label>
        <p>{formData.customer_description}</p>
        <input type="hidden" name="customer_description" value={formData.customer_description} />
      </div>
      <div>
        <label>
          Wood Keep:
          <select name="wood_keep" value={formData.wood_keep ? "true" : "false"} onChange={handleChange} required>
            <option value="true">Yes (Free)</option>
            <option value="false">No ($50.00)</option>
          </select>
        </label>
        <label>
          Stump Grinding:
          <select name="stump_grinding" value={formData.stump_grinding ? "true" : "false"} onChange={handleChange} required>
            <option value="true">Yes ($100.00)</option>
            <option value="false">No (Free)</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Service Type:
          <select name="service_type" value={formData.service_type} onChange={handleChange} required>
            <option value="Just a trim">Just a trim ($100.00 baseline)</option>
            <option value="Branch Removal">Branch Removal ($200.00 baseline)</option>
            <option value="Full Tree Service">Full Tree Service ($400.00 baseline)</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Job Scope:
          <select name="job_scope" value={formData.job_scope} onChange={handleChange} required>
            <option value="small">Small (Subtract $50)</option>
            <option value="medium">Medium (No change)</option>
            <option value="large">Large (Add $50)</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Discount (%):
          <input
            type="number"
            name="discount"
            placeholder="Discount percentage"
            onChange={handleChange}
            value={formData.discount}
            min="0"
            max="100"
          />
        </label>
      </div>
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
      <div>
        <strong>Total: ${formData.total_amount}</strong>
      </div>
      <button type="submit">Create Invoice</button>
    </form>
  );
};

export default InvoiceForm;
