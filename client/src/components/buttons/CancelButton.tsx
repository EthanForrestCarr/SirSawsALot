import React from 'react';

interface CancelButtonProps {
    onCancel: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onCancel }) => {
    return (
        <button 
            onClick={onCancel} 
            style={{ 
                position: 'absolute', 
                right: '0.5rem', 
                top: '0.5rem', 
                background: 'transparent', 
                border: 'none',
                cursor: 'pointer'
            }}
        >
            Cancel
        </button>
    );
};

export default CancelButton;
