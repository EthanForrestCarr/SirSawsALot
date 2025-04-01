import React from 'react';
import axios from 'axios';

interface InvoiceActionButtonsProps {
  invoice: any;
  onUpdate: () => void;
  onView: (invoice: any) => void;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({ invoice, onUpdate, onView }) => {
  const handleStatusUpdate = async (status: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:3000/admin/invoices/${invoice.id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/admin/invoices/${invoice.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleStatusUpdate('paid')}>Mark as Paid</button>
      <button onClick={() => handleStatusUpdate('canceled')}>Cancel</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => onView(invoice)}>View Invoice</button>
    </div>
  );
};

export default InvoiceActionButtons;
