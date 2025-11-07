import React from 'react';
import api from '../../utils/axiosConfig';

interface InvoiceActionButtonsProps {
  invoice: any;
  onUpdate: () => void;
  onView: (invoice: any) => void;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({ invoice, onUpdate, onView }) => {
  const handleStatusUpdate = async (status: string) => {
    try {
      await api.patch(`/admin/invoices/${invoice.id}`, { status });
      onUpdate();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/invoices/${invoice.id}`);
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
