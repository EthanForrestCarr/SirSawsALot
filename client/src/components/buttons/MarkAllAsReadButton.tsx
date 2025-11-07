import React from 'react';
import api from '../../utils/axiosConfig';
import "../../styles/Button.css";

interface MarkAllAsReadButtonProps {
    onMarkAsRead: () => void;
}

const MarkAllAsReadButton: React.FC<MarkAllAsReadButtonProps> = ({ onMarkAsRead }) => {
    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/mark-read', {});
            onMarkAsRead(); // Refresh notifications list after marking as read
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    return (
        <button onClick={markAllAsRead} className="btn-block">
            Mark All as Read
        </button>
    );
};

export default MarkAllAsReadButton;
