import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications: React.FC = () => {
  interface Notification {
    message: string;
    created_at: string;
    status: string;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch('http://localhost:3000/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: 'read' })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Notifications {notifications.length > 0 && `(${notifications.length})`}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute', top: '40px', right: '0',
          background: 'white', border: '1px solid #ccc', padding: '10px'
        }}>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                <p>{notif.message}</p>
                <small>{new Date(notif.created_at).toLocaleString()}</small>
              </div>
            ))
          )}
          <button onClick={markAsRead}>Mark All as Read</button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
