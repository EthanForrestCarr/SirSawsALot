import React from 'react';
import '../../styles/Table.css';
import InvoiceActionButtons from '../buttons/InvoiceActionButtons';

interface InvoiceTableProps {
  invoices: any[];
  onUpdate: () => void;
  onView: (invoice: any) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onUpdate, onView }) => {
  return (
    <div className="responsive-table">
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
              <td data-label="ID">{invoice.id}</td>
              <td data-label="Customer">
                {invoice.customer_first_name} {invoice.customer_last_name}
              </td>
              <td data-label="Amount">${invoice.total_amount}</td>
              <td data-label="Status">{invoice.status}</td>
              <td data-label="Due Date">
                {new Date(invoice.due_date).toLocaleDateString("en-US")}
              </td>
              <td data-label="Actions">
                <InvoiceActionButtons invoice={invoice} onUpdate={onUpdate} onView={onView} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
