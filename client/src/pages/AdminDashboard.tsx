import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [view, setView] = useState<'table' | 'calendar'>('table'); // Toggle between table and calendar
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/admin/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.requests || [];
        setRequests(data);
        setApprovedRequests(data.filter((req: any) => req.status === 'approved'));
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch requests.');
      }
    };

    fetchRequests();
  }, []);

  const getTileContent = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const requestsForDate = approvedRequests.filter(
      (req: any) => req.date === dateString
    );

    if (requestsForDate.length > 0) {
      return (
        <div style={{ background: 'lightgreen', borderRadius: '50%' }}>
          {requestsForDate.length} Job(s)
        </div>
      );
    }
    return null;
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
            {requests.map((req: any) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.description}</td>
                <td>{req.address}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => console.log('View Details')}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <Calendar tileContent={getTileContent} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


/* import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

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

    const updatedRequests =
      value === 'all'
        ? requests
        : requests.filter((req: any) => req.status === value);
    setFilteredRequests(updatedRequests);
    setCurrentPage(1); // Reset to the first page
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
    setCurrentPage(1); // Reset to the first page
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

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

      {currentItems.length > 0 ? (
        <>
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
              {currentItems.map((request: any) => (
                <tr key={request.id}>
                  <td
                    style={{ border: '1px solid #ccc', padding: '0.5rem', cursor: 'pointer', color: 'blue' }}
                    onClick={() => navigate(`/admin/requests/${request.id}`)} // Use navigate function
                  >
                    {request.id}
                  </td>
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

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ marginRight: '1rem' }}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ marginLeft: '1rem' }}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
 */
