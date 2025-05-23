import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkRequestButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/work-request')} id='work-request-button'>
      Work Request
    </button>
  );
};

export default WorkRequestButton;
