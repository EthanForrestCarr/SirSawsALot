import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarPicker from '../CalendarPicker';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const navigate = useNavigate(); // Initialize navigate function
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  // Function to update request status
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

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setView('table')} style={{ marginRight: '1rem' }}>
          Table View
        </button>
        <button onClick={() => setView('calendar')}>Calendar View</button>
      </div>

      {view === 'table' ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.description}</td>
                <td>{req.address}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => navigate(`/admin/requests/${req.id}`)}>Details</button>
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'approved')}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'denied')}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        Deny
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <CalendarPicker />

      )}
    </div>
  );
};

export default AdminDashboard;
