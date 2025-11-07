import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';

interface Message {
  id: number;
  is_admin: boolean;
  message: string;
  created_at: string;
}

interface AdminMessagesProps {
  userId: number;
  userName?: string; // new optional prop
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ userId, userName: initialUserName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // Use the passed userName or default to "User {userId}"
  const [userName] = useState(initialUserName || `User ${userId}`);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/user/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Removed fetchUserName to avoid calling GET /users/:id
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const response = await api.post(
        `/messages/user/${userId}`,
        { message: newMessage },
      );
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Conversation with {userName}</h3> {/* updated header */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ textAlign: msg.is_admin ? 'left' : 'right', margin: '0.5rem 0' }}>
            <p>{msg.message}</p>
            <small>{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '100%', height: '60px' }}
        />
        <button type="submit" style={{ marginTop: '0.5rem' }}>Send</button>
      </form>
    </div>
  );
};

export default AdminMessages;
