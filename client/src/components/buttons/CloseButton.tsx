import React from 'react';
import "../../styles/Button.css";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="btn-close">
    &times;
  </button>
);

export default CloseButton;
