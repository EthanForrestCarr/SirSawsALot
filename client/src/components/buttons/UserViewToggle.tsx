import React from 'react';
import "../../styles/Button.css";

interface UserViewToggleProps {
  view: 'requests' | 'invoices' | 'messages' | 'profile';
  setView: (view: 'requests' | 'invoices' | 'messages' | 'profile') => void;
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

export default UserViewToggle;