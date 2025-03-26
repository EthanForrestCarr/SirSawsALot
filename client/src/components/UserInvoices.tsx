import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Invoice {
  id: number;
  status: string;
  total_amount: number;
  due_date: string;
  created_at: string;
}

interface UserInvoicesProps {
  onViewInvoice: (invoice: any) => void;
}

const UserInvoices: React.FC<UserInvoicesProps> = ({ onViewInvoice }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter work requests that contain an invoice and map to invoice objects
        const fetchedInvoices = response.data.requests
          .filter((req: any) => req.invoice)
          .map((req: any) => req.invoice);
        setInvoices(fetchedInvoices);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching invoices.');
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      <h3>Your Invoices:</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="universal-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Due Date</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.status}</td>
                <td>{inv.total_amount ? `$${Number(inv.total_amount).toFixed(2)}` : '-'}</td>
                <td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                <td>{new Date(inv.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => onViewInvoice(inv)}>View Invoice</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserInvoices;