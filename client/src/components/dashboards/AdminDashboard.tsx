import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarPicker from '../CalendarPicker';
import Pagination from '../buttons/Pagination';
import AdminRequestsTable from '../tables/AdminRequestsTable';
import AdminInvoices from '../AdminInvoices';
import InvoiceModal from '../modals/InvoiceFormModal';
import { InvoiceFormData } from '../forms/InvoiceForm';
import BlockDateForm from '../forms/BlockDateForm';
import AdminConversations from '../messages/AdminConversations';
import UserProfileForm from '../forms/UserProfileForm';
import UpdatePasswordForm from '../forms/UpdatePassowrdForm';

interface AdminDashboardProps {
	// initialView defaults to 'table' if not provided
	initialView?: 'table' | 'calendar' | 'invoices' | 'messages' | 'profile';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialView }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'table' | 'calendar' | 'invoices' | 'messages' | 'profile'>(initialView || 'table');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  // New state for Invoice Modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [prefillData, setPrefillData] = useState<InvoiceFormData | null>(null);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/admin/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests || []);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch requests.');
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    setView(initialView || 'table');
  }, [initialView]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setFirstName(response.data.first_name);
      })
      .catch(err => console.error('Error fetching user:', err));
    }
  }, []);

  const updateRequestStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:3000/admin/requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update request.');
    }
  };

  // onOpenModal callback passed to the requests table and ultimately to the GenerateInvoiceButton.
  const openModal = (data: InvoiceFormData) => {
    console.log("AdminDashboard openModal called with data:", data);
    setPrefillData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing Invoice Modal");
    setModalOpen(false);
    setPrefillData(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Hi, {firstName}</h2>
      {message && <p>{message}</p>}

      {view === 'table' ? (
        <>
          <AdminRequestsTable
            requests={requests}
            currentPage={currentPage}
            requestsPerPage={requestsPerPage}
            updateRequestStatus={updateRequestStatus}
            onPrefill={(data) => console.log("Prefill data:", data)}
            onOpenModal={openModal} // Pass callback so GenerateInvoiceButton can trigger the modal
          />
          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalItems={requests.length}
            itemsPerPage={requestsPerPage}
            paginate={setCurrentPage}
          />
        </>
      ) : view === 'calendar' ? (
        <>
        <CalendarPicker />
        <BlockDateForm />
        </>
      ) : view === 'messages' ? (
          <AdminConversations />
      ) : view === 'invoices' ? (
        <AdminInvoices />
      ) : view === 'profile' ? (
        <>
          <UserProfileForm />
          <UpdatePasswordForm />
        </>
      ) : null}

      {/* Render Invoice Modal if modalOpen is true */}
      <InvoiceModal
        open={modalOpen}
        initialData={prefillData || undefined}
        onClose={closeModal}
        onUpdate={() => {
          // You can add additional invoice update behaviors here if needed.
          closeModal();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
