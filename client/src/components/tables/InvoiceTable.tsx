import React from 'react';
import '../../styles/Table.css';
import InvoiceActionButtons from '../buttons/InvoiceActionButtons';

interface InvoiceTableProps {
  invoices: any[];
  onUpdate: () => void;
  onView: (invoice: any) => void; // New prop for viewing invoice details
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onUpdate, onView }) => {

  return (
    <table className="universal-table">
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
            <td>{invoice.customer_first_name} {invoice.customer_last_name}</td>
            <td>${invoice.total_amount}</td>
            <td>{invoice.status}</td>
            <td>{new Date(invoice.due_date).toLocaleDateString("en-US")}</td>
            <td>
              <InvoiceActionButtons invoice={invoice} onUpdate={onUpdate} onView={onView} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
