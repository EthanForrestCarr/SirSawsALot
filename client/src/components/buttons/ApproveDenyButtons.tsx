import React from 'react';
import "../../styles/Button.css";

interface ApproveDenyButtonsProps {
  requestId: number;
  updateRequestStatus: (id: number, status: string) => void;
}

const ApproveDenyButtons: React.FC<ApproveDenyButtonsProps> = ({ requestId, updateRequestStatus }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button 
        onClick={() => updateRequestStatus(requestId, 'approved')}
        className="btn-approve"
      >
        Approve
      </button>
      <button 
        onClick={() => updateRequestStatus(requestId, 'denied')}
        className="btn-deny"
      >
        Deny
      </button>
    </div>
  );
};

export default ApproveDenyButtons;
