import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: 'transparent',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer'
    }}
  >
    &times;
  </button>
);

export default CloseButton;
