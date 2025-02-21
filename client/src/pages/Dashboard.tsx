import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from '../components/dashboards/UserDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

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

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
