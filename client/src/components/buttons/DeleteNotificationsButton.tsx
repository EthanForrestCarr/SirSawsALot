import React from 'react';
import api from '../../utils/axiosConfig';
import "../../styles/Button.css";

interface DeleteNotificationsButtonProps {
    onDelete: () => void;
}

const DeleteNotificationsButton: React.FC<DeleteNotificationsButtonProps> = ({ onDelete }) => {
    const deleteNotifications = async () => {
        try {
            await api.delete('/notifications');
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
