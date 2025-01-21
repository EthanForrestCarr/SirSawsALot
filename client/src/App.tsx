import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import UserDashboard from './pages/UserDashboard';
import WorkRequestForm from './pages/WorkRequest';
import AdminDashboard from './pages/AdminDashboard';
import RequestDetailsPage from './pages/RequestDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/work-request" element={<WorkRequestForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/requests/:id" element={<RequestDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;