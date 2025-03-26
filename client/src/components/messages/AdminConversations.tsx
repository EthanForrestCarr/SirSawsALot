import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMessages from './AdminMessages';

interface Conversation {
  user_id: number;
  first_name: string;
  last_name: string;
}

const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  if (selectedUserId !== null) {
    return (
      <div>
        <button onClick={() => setSelectedUserId(null)}>← Back to Conversations</button>
        <AdminMessages userId={selectedUserId} />
      </div>
    );
  }

  return (
    <div>
      <h3>Conversations</h3>
      <ul>
        {conversations.map(conv => (
          <li key={conv.user_id} style={{ cursor: 'pointer', margin: '0.5rem 0' }} onClick={() => setSelectedUserId(conv.user_id)}>
            {conv.first_name} {conv.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminConversations;
