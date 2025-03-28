import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserRequestsTable from '../tables/UserRequestsTable';
import InvoiceViewModal from '../modals/InvoiceViewModal';
import UserInvoices from '../UserInvoices';
import MessagesView from '../messages/MessagesView';
// Import profile forms
import UserProfileForm from '../forms/UserProfileForm';
import UpdatePasswordForm from '../forms/UpdatePassowrdForm';

interface UserDashboardProps {
  // initialView defaults to 'requests' if not provided
  initialView?: 'requests' | 'invoices' | 'messages' | 'profile';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ initialView }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  // Updated view state initialization:
  const [view, setView] = useState<'requests' | 'invoices' | 'messages' | 'profile'>(initialView || 'requests');
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

  useEffect(() => {
    setView(initialView || 'requests');
  }, [initialView]);

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
      {view === 'requests' ? (
        <>
          <h3>Your Work Requests:</h3>
          {requests.length > 0 ? (
            <UserRequestsTable requests={requests} onViewInvoice={handleViewInvoice} />
          ) : (
            <p>No work requests found.</p>
          )}
        </>
      ) : view === 'messages' ? (
        <MessagesView />
      ) : view === 'invoices' ? (
        <UserInvoices onViewInvoice={handleViewInvoice} />
      ) : view === 'profile' ? (
        <>
          <UserProfileForm />
          <UpdatePasswordForm />
        </>
      ) : null}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceViewModal invoice={selectedInvoice} onClose={closeInvoiceModal} />
      )}
    </div>
  );
};

export default UserDashboard;
