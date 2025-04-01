import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMessages from './AdminMessages';
import NameAddressInput from '../inputs/NameAddressInput';
import CancelButton from '../buttons/CancelButton';

interface Conversation {
  user_id: number;
  first_name: string;
  last_name: string;
  latest_message_preview: string;
  latest_message_created_at: string;
}

const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [conversationsToDelete, setConversationsToDelete] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/user/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    }
  };

  const handleDeleteConversations = async (convs: Conversation[]) => {
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        convs.map(conv =>
          axios.delete(`http://localhost:3000/messages/user/${conv.user_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );
      setConversations(prev => prev.filter(conv => !convs.some(d => d.user_id === conv.user_id)));
      setConversationsToDelete([]);
      setDeleteMode(false);
    } catch (error) {
      console.error('Error deleting conversations:', error);
    }
  };

  if (selectedConversation) {
    return (
      <div>
        <button onClick={() => setSelectedConversation(null)}>←</button>
        <AdminMessages 
          userId={selectedConversation.user_id} 
          userName={`${selectedConversation.first_name} ${selectedConversation.last_name}`} 
        />
      </div>
    );
  }

  return (
    <div>
      <h3>Conversations</h3>
      <NameAddressInput
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            handleSearch(q);
          }}
          searchResults={searchResults}
          onSelectUser={(user) => {
            setSelectedConversation({
              user_id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              latest_message_preview: '',
              latest_message_created_at: new Date().toISOString()
            });
            setSearchQuery('');
            setSearchResults([]);
          }}
      />
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {conversations.map(conv => {
          const isSelected = conversationsToDelete.some(d => d.user_id === conv.user_id);
          return (
            <li
              key={conv.user_id}
              style={{ 
                cursor: 'pointer', 
                margin: '0.5rem 0', 
                padding: '0.5rem', 
                borderBottom: '1px solid #ccc',
                backgroundColor: deleteMode && isSelected ? '#fdecea' : undefined
              }}
              onClick={() => {
                if (deleteMode) {
                  if (isSelected) {
                    setConversationsToDelete(prev => prev.filter(d => d.user_id !== conv.user_id));
                  } else {
                    setConversationsToDelete(prev => [...prev, conv]);
                  }
                } else {
                  setSelectedConversation(conv);
                }
              }}
            >
              <div>
                <strong>{conv.first_name} {conv.last_name}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {conv.latest_message_preview} <span> | </span>
                {new Date(conv.latest_message_created_at).toLocaleTimeString()}
              </div>
            </li>
          );
        })}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        {deleteMode ? (
          <>
            <CancelButton onClick={() => { setDeleteMode(false); setConversationsToDelete([]); }}>
              Cancel
            </CancelButton>
            {conversationsToDelete.length > 0 && (
              <button 
                onClick={() => handleDeleteConversations(conversationsToDelete)}
                style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: '#fff' }}
              >
                Confirm Delete for {conversationsToDelete.map(conv => conv.first_name).join(', ')}
              </button>
            )}
          </>
        ) : (
          <button onClick={() => setDeleteMode(true)}>
              Delete Conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminConversations;
