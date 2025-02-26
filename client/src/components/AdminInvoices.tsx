import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTable from './tables/InvoiceTable';
import InvoiceForm from './forms/InvoiceForm';

const AdminInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(response.data);
    } catch (err) {
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Invoices</h2>
      {loading ? <p>Loading invoices...</p> : error ? <p>{error}</p> : <InvoiceTable invoices={invoices} onUpdate={fetchInvoices} />}
      <h3>Create New Invoice</h3>
      <InvoiceForm onUpdate={fetchInvoices} />
    </div>
  );
};

export default AdminInvoices;
