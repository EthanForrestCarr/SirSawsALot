import React from 'react';
import axios from 'axios';

interface GenerateInvoiceButtonProps {
  request: {
    id: number;
    first_name: string; // Added first_name from the work request
    last_name: string;
    address: string;
    description: string;
    wood_keep?: boolean;
    stump_grinding?: boolean;
    // ... include any other fields that you might need, e.g. customer_email, customer_phone if available
  };
  onInvoiceCreated?: () => void;
}

const GenerateInvoiceButton: React.FC<GenerateInvoiceButtonProps> = ({
  request,
  onInvoiceCreated = () => {},
}) => {
  const handleGenerateInvoice = async () => {
    const token = localStorage.getItem('token');
    // Pre-fill invoice details from the work request
    const invoiceData = {
      request_id: request.id,
      customer_first_name: request.first_name,
      customer_last_name: request.last_name,
      customer_email: '', // Populate if available in request
      customer_phone: '', // Populate if available in request
      address: request.address,
      work_description:
        request.description +
        `\nWood Keep: ${request.wood_keep ? 'Yes' : 'No'}` +
        `\nStump Grinding: ${request.stump_grinding ? 'Yes' : 'No'}`,
      total_amount: 100, // Default pricing value; update as needed
      due_date: new Date().toISOString().split('T')[0], // Default due date; adjust as needed
      notes: '',
    };

    try {
      await axios.post('http://localhost:3000/admin/invoices', invoiceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Invoice generated successfully.');
      onInvoiceCreated();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error generating invoice.');
    }
  };

  return (
    <button
      onClick={handleGenerateInvoice}
      style={{ padding: '5px 10px', margin: '0.2rem' }}
    >
      Generate Invoice
    </button>
  );
};

export default GenerateInvoiceButton;