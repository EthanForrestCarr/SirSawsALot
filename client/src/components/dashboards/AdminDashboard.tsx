import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarPicker from '../CalendarPicker';
import Pagination from '../buttons/Pagination';
import AdminRequestsTable from '../tables/AdminRequestsTable'; // Import the table component
import AdminViewToggle from '../buttons/AdminViewToggle'; // Import the view toggle component
import AdminInvoices from '../AdminInvoices'; // 📌 Import Invoice Management

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'table' | 'calendar' | 'invoices'>('table');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}

      {/* View Toggle Component */}
      <AdminViewToggle view={view} setView={setView} />

      {view === 'table' ? (
        <>
          <AdminRequestsTable
            requests={requests}
            currentPage={currentPage}
            requestsPerPage={requestsPerPage}
            updateRequestStatus={updateRequestStatus}
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
        <CalendarPicker />
      ) : (
        <AdminInvoices /> // ✅ Invoice Management Component
      )}
    </div>
  );
};

export default AdminDashboard;
