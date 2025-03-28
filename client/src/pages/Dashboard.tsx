import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from '../components/dashboards/UserDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const viewParam = new URLSearchParams(location.search).get('view');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if no token exists
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login'); // Redirect to login
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (isAdmin === null) {
    return <p>Loading...</p>; // Prevent UI from flashing before data loads
  }

  // Determine valid initial view based on isAdmin:
  const initialView = isAdmin
    ? (viewParam === 'table' || viewParam === 'calendar' || viewParam === 'invoices' || viewParam === 'messages' || viewParam === 'profile'
        ? viewParam
        : 'table')
    : (viewParam === 'requests' || viewParam === 'invoices' || viewParam === 'messages' || viewParam === 'profile'
        ? viewParam
        : 'requests');

  return isAdmin 
    ? <AdminDashboard initialView={initialView as any} /> 
    : <UserDashboard initialView={initialView as any} />;
};

export default Dashboard;
