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
        <div className="input-container">
            <label className="input-label">Search:</label>
            <input
                className="input-field"
                type="text"
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
            />
            {searchResults.length > 0 && (
                <ul className="search-results">
                    {searchResults.map(user => (
                        <li
                            key={user.id}
                            className="search-item"
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
