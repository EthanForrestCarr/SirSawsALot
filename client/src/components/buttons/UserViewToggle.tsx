import React from 'react';
import "../../styles/Button.css";

interface UserViewToggleProps {
  view: 'requests' | 'invoices';
  setView: (view: 'requests' | 'invoices') => void;
}

const UserViewToggle: React.FC<UserViewToggleProps> = ({ view, setView }) => {
  return (
    <div className="btn-toggle-container">
      <button 
        onClick={() => setView('requests')}
        className={`btn-toggle ${view === 'requests' ? 'active' : ''}`}
      >
        Requests
      </button>
      <button 
        onClick={() => setView('invoices')}
        className={`btn-toggle ${view === 'invoices' ? 'active' : ''}`}
      >
        Invoices
      </button>
    </div>
  );
};

export default UserViewToggle;