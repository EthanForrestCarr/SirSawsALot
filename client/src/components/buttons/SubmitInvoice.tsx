import React from 'react';
import axios from 'axios';

interface SubmitInvoiceProps {
  invoice: any;
  onSuccess: () => void;
}

const SubmitInvoice: React.FC<SubmitInvoiceProps> = ({ invoice, onSuccess }) => {
  const handleSubmitInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/admin/invoices/${invoice.id}`,
        { status: 'submitted' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting invoice:', error);
      alert(error.response?.data?.message || 'Error submitting invoice.');
    }
  };

  return (
    <button onClick={handleSubmitInvoice} className="btn-block" style={{ marginTop: '1rem' }}>
      Submit Invoice to User
    </button>
  );
};

export default SubmitInvoice;
