import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications: React.FC = () => {
  interface Notification {
    id: number;
    message: string;
    created_at: string;
    status: boolean;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.status).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch('http://localhost:3000/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update unread count from response
      setUnreadCount(response.data.unreadCount);

      // Update state to mark all as read
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowDropdown(!showDropdown)}>
        Notifications {unreadCount > 0 && `(${unreadCount})`}
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
              <div key={index} style={{ marginBottom: '5px', opacity: notif.status ? 0.5 : 1 }}>
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
