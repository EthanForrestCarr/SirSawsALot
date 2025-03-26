import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  is_admin: boolean;
  message: string;
  created_at: string;
}

interface AdminMessagesProps {
  userId: number;
}

const AdminMessages: React.FC<AdminMessagesProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/messages/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/messages/user/${userId}`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Conversation with User {userId}</h3>
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
