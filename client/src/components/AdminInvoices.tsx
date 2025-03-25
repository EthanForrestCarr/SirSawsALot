import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTable from './tables/InvoiceTable';
import InvoiceModal from './modals/InvoiceFormModal';
import { InvoiceFormData } from './forms/InvoiceForm';
import InvoiceViewModal from './modals/InvoiceViewModal';

const AdminInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [prefillData, setPrefillData] = useState<InvoiceFormData | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    console.log("AdminInvoices mounted, fetching invoices...");
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/admin/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched invoices:", response.data);
      setInvoices(response.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    console.log("Closing Invoice Modal");
    setModalOpen(false);
    setPrefillData(null);
  };

  const openViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
  };

  const closeViewInvoice = () => {
    setViewModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div>
      <h2>Invoices</h2>
      {loading ? (
        <p>Loading invoices...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <InvoiceTable 
          invoices={invoices} 
          onUpdate={fetchInvoices} 
          onView={openViewInvoice} // Pass the view callback
        />
      )}
      <InvoiceModal
        open={modalOpen}
        initialData={prefillData || undefined}
        onClose={closeModal}
        onUpdate={fetchInvoices}
      />
      {viewModalOpen && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={closeViewInvoice}
        />
      )}
    </div>
  );
};

export default AdminInvoices;
