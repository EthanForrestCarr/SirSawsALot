import React from 'react';
import "../../styles/Button.css";

interface BlockDateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const BlockDateButton: React.FC<BlockDateButtonProps> = (props) => {
  return (
    <button
      {...props}
      className={`btn ${props.className ? props.className : ''}`}
    >
      {props.children || 'Block Date'}
    </button>
  );
};

export default BlockDateButton;
