import React from 'react';
import api from '../../utils/axiosConfig';

interface SubmitInvoiceProps {
  invoice: any;
  onSuccess: () => void;
}

const SubmitInvoice: React.FC<SubmitInvoiceProps> = ({ invoice, onSuccess }) => {
  const handleSubmitInvoice = async () => {
    try {
      const response = await api.patch(
        `/admin/invoices/${invoice.id}`,
        { status: 'submitted' },
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
