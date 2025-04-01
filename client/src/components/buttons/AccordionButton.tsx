import React, { useState } from 'react';
import SignOutButton from './SignOutButton';

interface DropdownItem {
  label: string;
  value: string;
}

interface AccordionButtonProps {
  isAdmin: boolean;
  onSelect: (value: string) => void;
  onSignOut: () => void;
}

const AccordionButton: React.FC<AccordionButtonProps> = ({ isAdmin, onSelect, onSignOut }) => {
  const [open, setOpen] = useState(false);

  const dashboardOptions: DropdownItem[] = isAdmin
    ? [
        { label: 'Requests', value: 'table' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Invoices', value: 'invoices' },
        { label: 'Messages', value: 'messages' },
        { label: 'Profile', value: 'profile' },
      ]
    : [
        { label: 'Requests', value: 'requests' },
        { label: 'Invoices', value: 'invoices' },
        { label: 'Messages', value: 'messages' },
        { label: 'Profile', value: 'profile' },
      ];

  const toggleDropdown = () => setOpen(prev => !prev);
  const handleItemClick = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <div className="dropdown-wrapper">
      <button onClick={toggleDropdown} className="accordion">
        <div className={`menu-icon ${open ? 'change' : ''}`}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </button>
      <div className="panel" style={{ maxHeight: open ? '300px' : '0px' }}>
        {dashboardOptions.map(item => (
          <button 
            key={item.value} 
            onClick={() => handleItemClick(item.value)}
            className="dropdown-item"
          >
            {item.label}
          </button>
        ))}
        <SignOutButton onClick={() => { onSignOut(); setOpen(false); }} className="dropdown-item" />
      </div>
    </div>
  );
};

export default AccordionButton;
