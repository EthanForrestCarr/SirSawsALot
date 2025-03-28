import React from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
}

interface NameAddressInputProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchResults: User[];
    onSelectUser: (user: User) => void;
}

const NameAddressInput: React.FC<NameAddressInputProps> = ({
    searchQuery,
    onSearchChange,
    searchResults,
    onSelectUser,
}) => {
    return (
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <input
                type="text"
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
                autoComplete="off"
            />
            {searchResults.length > 0 && (
                <ul style={{ 
                    listStyleType: 'none', 
                    padding: 0,
                    margin: 0,
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    background: 'grey',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {searchResults.map(user => (
                        <li
                            key={user.id}
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderBottom: '1px solid #eee'
                            }}
                            onClick={() => onSelectUser(user)}
                        >
                            <strong>{user.first_name} {user.last_name}</strong> – {user.address}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NameAddressInput;
