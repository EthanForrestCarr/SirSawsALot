import React from 'react';
import axios from 'axios';

interface MarkAllAsReadButtonProps {
    onMarkAsRead: () => void;
}

const MarkAllAsReadButton: React.FC<MarkAllAsReadButtonProps> = ({ onMarkAsRead }) => {
    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch('http://localhost:3000/notifications/mark-read', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onMarkAsRead(); // Refresh notifications list after marking as read
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    return (
        <button onClick={markAllAsRead} style={{ marginTop: '10px', display: 'block', width: '100%' }}>
            Mark All as Read
        </button>
    );
};

export default MarkAllAsReadButton;
