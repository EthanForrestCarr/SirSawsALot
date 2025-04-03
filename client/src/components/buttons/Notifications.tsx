import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MarkAllAsReadButton from './MarkAllAsReadButton';
import DeleteNotificationsButton from './DeleteNotificationsButton';

const Notifications: React.FC = () => {
  interface Notification {
    id: number;
    message: string;
    created_at: string;
    is_read: boolean;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)} 
        className="notification"
      >
        {"🔔"}
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute', top: '55px', right: '0', // changed from right: '0'
          background: 'white', border: '1px solid #ccc', padding: '10px', width: '300px'
        }}>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <>
              {notifications.map((notif) => (
                <div key={notif.id} style={{
                  opacity: notif.is_read ? 0.5 : 1,
                  borderBottom: '1px solid #ddd',
                }}>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.created_at).toLocaleString()}</small>
                </div>
              ))}
              {unreadCount > 0 ? (
                <MarkAllAsReadButton onMarkAsRead={fetchNotifications} />
              ) : (
                <DeleteNotificationsButton onDelete={fetchNotifications} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
