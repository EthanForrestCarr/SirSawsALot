import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import UserDashboard from './pages/UserDashboard';
import WorkRequestForm from './pages/WorkRequest';
import AdminDashboard from './pages/AdminDashboard';
import RequestDetailsPage from './pages/RequestDetails';
import UserProfile from './pages/UserProfile';
import CalendarPage from './pages/Calendar';
import axios from 'axios';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.is_admin);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/work-request" element={<WorkRequestForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/calendar" element={<CalendarPage />} /> {/* Calendar Page for Admins */}
      </Routes>
    </Router>
  );
};

export default App;
