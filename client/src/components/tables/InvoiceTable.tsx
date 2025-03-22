import React from 'react';
import axios from 'axios';

interface InvoiceTableProps {
  invoices: any[];
  onUpdate: () => void;
  onView: (invoice: any) => void; // New prop for viewing invoice details
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onUpdate, onView }) => {
  const handleStatusUpdate = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:3000/admin/invoices/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/admin/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td>
            <td>{invoice.customer_name}</td>
            <td>${invoice.total_amount}</td>
            <td>{invoice.status}</td>
            <td>{invoice.due_date}</td>
            <td>
              <button onClick={() => handleStatusUpdate(invoice.id, 'paid')}>Mark as Paid</button>
              <button onClick={() => handleStatusUpdate(invoice.id, 'canceled')}>Cancel</button>
              <button onClick={() => handleDelete(invoice.id)}>Delete</button>
              <button onClick={() => onView(invoice)}>View Invoice</button> {/* New button */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
