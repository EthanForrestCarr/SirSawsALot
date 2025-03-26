import React from 'react';
import axios from 'axios';
import "../../styles/Button.css";

interface DeleteNotificationsButtonProps {
    onDelete: () => void;
}

const DeleteNotificationsButton: React.FC<DeleteNotificationsButtonProps> = ({ onDelete }) => {
    const deleteNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete('http://localhost:3000/notifications', {
                headers: { Authorization: `Bearer ${token}` },
            });
            onDelete(); // Refresh notifications list after deletion
        } catch (error) {
            console.error('Error deleting notifications:', error);
        }
    };

    return (
        <button onClick={deleteNotifications} className="btn-block">
            Delete Notifications
        </button>
    );
};

export default DeleteNotificationsButton;
