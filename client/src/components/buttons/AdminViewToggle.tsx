import React from 'react';

interface AdminViewToggleProps {
  view: 'table' | 'calendar' | 'invoices';
  setView: (view: 'table' | 'calendar' | 'invoices') => void;
}

const AdminViewToggle: React.FC<AdminViewToggleProps> = ({ view, setView }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <button 
        onClick={() => setView('table')} 
        style={{ marginRight: '1rem', fontWeight: view === 'table' ? 'bold' : 'normal' }}
      >
        Table View
      </button>
      <button 
        onClick={() => setView('calendar')} 
        style={{ marginRight: '1rem', fontWeight: view === 'calendar' ? 'bold' : 'normal' }}
      >
        Calendar View
      </button>
      <button 
        onClick={() => setView('invoices')} 
        style={{ fontWeight: view === 'invoices' ? 'bold' : 'normal' }}
      >
        Invoices View
      </button>
    </div>
  );
};

export default AdminViewToggle;
