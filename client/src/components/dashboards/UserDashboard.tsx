import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserRequestsTable from '../tables/UserRequestsTable';
import InvoiceViewModal from '../modals/InvoiceViewModal';
import UserViewToggle from '../buttons/UserViewToggle';
import UserInvoices from '../UserInvoices';

const UserDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  // New state for switching views: 'requests' or 'invoices'
  const [view, setView] = useState<'requests' | 'invoices'>('requests');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching requests.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <UserViewToggle view={view} setView={setView} />
      
      {view === 'requests' ? (
        <>
          <h3>Your Work Requests:</h3>
          {requests.length > 0 ? (
            <UserRequestsTable requests={requests} onViewInvoice={handleViewInvoice} />
          ) : (
            <p>No work requests found.</p>
          )}
        </>
      ) : (
        <UserInvoices onViewInvoice={handleViewInvoice} />
      )}
      
      {showInvoiceModal && selectedInvoice && (
        <InvoiceViewModal invoice={selectedInvoice} onClose={closeInvoiceModal} />
      )}
    </div>
  );
};

export default UserDashboard;
