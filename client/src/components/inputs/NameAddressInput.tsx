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
    onCancel: () => void;
    searchResults: User[];
    onSelectUser: (user: User) => void;
}

const NameAddressInput: React.FC<NameAddressInputProps> = ({
    searchQuery,
    onSearchChange,
    onCancel,
    searchResults,
    onSelectUser,
}) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <input
                type="text"
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ width: '80%', padding: '0.5rem' }}
            />
            <button onClick={onCancel} style={{ marginLeft: '0.5rem' }}>
                Cancel
            </button>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                {searchResults.map(user => (
                    <li
                        key={user.id}
                        style={{
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderBottom: '1px solid #ccc'
                        }}
                        onClick={() => onSelectUser(user)}
                    >
                        <strong>
                            {user.first_name} {user.last_name}
                        </strong> – {user.address}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NameAddressInput;
