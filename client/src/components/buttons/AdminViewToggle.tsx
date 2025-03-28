import React from 'react';
import "../../styles/Button.css";

interface AdminViewToggleProps {
  view: 'table' | 'calendar' | 'invoices' | 'messages' | 'profile';
  setView: (view: 'table' | 'calendar' | 'invoices' | 'messages' | 'profile') => void;
}

const AdminViewToggle: React.FC<AdminViewToggleProps> = ({ view, setView }) => {
  return (
    <div className="btn-toggle-container">
      <button 
        onClick={() => setView('table')}
        className={`btn-toggle ${view === 'table' ? 'active' : ''}`}
      >
        Requests
      </button>
      <button 
        onClick={() => setView('calendar')}
        className={`btn-toggle ${view === 'calendar' ? 'active' : ''}`}
      >
        Calendar
      </button>
      <button 
        onClick={() => setView('invoices')}
        className={`btn-toggle ${view === 'invoices' ? 'active' : ''}`}
      >
        Invoices
      </button>
      <button 
        onClick={() => setView('messages')}
        className={`btn-toggle ${view === 'messages' ? 'active' : ''}`}
      >
        Messages
      </button>
      <button 
        onClick={() => setView('profile')}
        className={`btn-toggle ${view === 'profile' ? 'active' : ''}`}
      >
        Profile
      </button>
    </div>
  );
};

export default AdminViewToggle;
