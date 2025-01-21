import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/admin/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests || []);
        setFilteredRequests(response.data.requests || []);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch requests.');
      }
    };

    fetchRequests();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilter(value);

    if (value === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((req: any) => req.status === value));
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    const sortedRequests = [...filteredRequests].sort((a: any, b: any) => {
      if (value === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (value === 'id') {
        return a.id - b.id;
      }
      return 0;
    });

    setFilteredRequests(sortedRequests);
  };

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
        prev.map((req: any) => (req.id === id ? { ...req, status } : req))
      );
      setFilteredRequests((prev) =>
        prev.map((req: any) => (req.id === id ? { ...req, status } : req))
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
        <label>Filter by Status:</label>
        <select value={filter} onChange={handleFilterChange} style={{ marginLeft: '0.5rem' }}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Sort by:</label>
        <select value={sortBy} onChange={handleSortChange} style={{ marginLeft: '0.5rem' }}>
          <option value="created_at">Date Created</option>
          <option value="id">Request ID</option>
        </select>
      </div>

      {filteredRequests.length > 0 ? (
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
            {filteredRequests.map((request: any) => (
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
