import React from 'react';
import { WorkRequestEvent } from '../../interfaces/WorkRequestEvent';

interface RequestDetailsModalProps {
  event: WorkRequestEvent;
  onClose: () => void;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ event, onClose }) => {
  return (
    <div className="modal">
      <h3>Request Details</h3>
      {event.type === 'work-request' && (
        <>
          <p><strong>Address:</strong> {event.address}</p>
          <p><strong>Name:</strong> {event.name}</p>
          <p><strong>Status:</strong> {event.status}</p>
        </>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default RequestDetailsModal;