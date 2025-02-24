import React from 'react';

interface AdminViewToggleProps {
  view: 'table' | 'calendar';
  setView: (view: 'table' | 'calendar') => void;
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
        style={{ fontWeight: view === 'calendar' ? 'bold' : 'normal' }}
      >
        Calendar View
      </button>
    </div>
  );
};

export default AdminViewToggle;
