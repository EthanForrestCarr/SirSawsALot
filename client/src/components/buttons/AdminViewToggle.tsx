import React from 'react';
import "../../styles/Button.css";

interface AdminViewToggleProps {
  view: 'table' | 'calendar' | 'invoices';
  setView: (view: 'table' | 'calendar' | 'invoices') => void;
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
        className={`btn-toggle no-margin ${view === 'invoices' ? 'active' : ''}`}
      >
        Invoices
      </button>
    </div>
  );
};

export default AdminViewToggle;
