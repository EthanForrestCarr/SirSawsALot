import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  interface Request {
    id: number;
    description: string;
    address: string;
    status: string;
  }

  const [requests, setRequests] = useState<Request[]>([]);
  const [message, setMessage] = useState('');

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
      setMessage(`Request ${id} updated to ${status}.`);
      setRequests((prev) =>
        prev.map((req: any) =>
          req.id === id ? { ...req, status } : req
        )
      );
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update request.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      {requests.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Description</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Address</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request: any) => (
              <tr key={request.id}>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{request.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{request.description}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{request.address}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{request.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  <button
                    onClick={() => updateRequestStatus(request.id, 'approved')}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Approve
                  </button>
                  <button onClick={() => updateRequestStatus(request.id, 'denied')}>
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
