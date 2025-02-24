import React from 'react';

interface ApproveDenyButtonsProps {
  requestId: number;
  updateRequestStatus: (id: number, status: string) => void;
}

const ApproveDenyButtons: React.FC<ApproveDenyButtonsProps> = ({ requestId, updateRequestStatus }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => updateRequestStatus(requestId, 'approved')} style={{ backgroundColor: 'green', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
        Approve
      </button>
      <button onClick={() => updateRequestStatus(requestId, 'denied')} style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}>
        Deny
      </button>
    </div>
  );
};

export default ApproveDenyButtons;
