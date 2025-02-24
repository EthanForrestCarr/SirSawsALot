import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DetailsButtonProps {
  requestId: number;
}

const DetailsButton: React.FC<DetailsButtonProps> = ({ requestId }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/admin/requests/${requestId}`)}>
      Details
    </button>
  );
};

export default DetailsButton;
