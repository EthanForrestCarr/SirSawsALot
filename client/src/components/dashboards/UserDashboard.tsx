import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching requests.');
        localStorage.removeItem('token'); // Clear token if it's invalid
        navigate('/login'); // Redirect to login
      }
    };

    fetchRequests();
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Your Work Requests:</h3>
      {requests.length > 0 ? (
        <ul>
          {requests.map((req: any) => (
            <li key={req.id}>
              <strong>{req.id}</strong> - {req.status} (Created: {new Date(req.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No work requests found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
