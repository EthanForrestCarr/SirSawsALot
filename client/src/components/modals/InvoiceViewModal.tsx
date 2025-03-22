import React from 'react';

interface InvoiceViewModalProps {
  invoice: any;
  onClose: () => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'grey',
          padding: '1rem',
          borderRadius: '8px',
          width: '80%',
          maxWidth: '600px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <h3 style={{ textAlign: 'center' }}>Invoice Details</h3>
        <div>
          <p><strong>Invoice ID:</strong> {invoice.id}</p>
          <p><strong>Customer First Name:</strong> {invoice.customer_first_name}</p>
          <p><strong>Customer Last Name:</strong> {invoice.customer_last_name}</p>
          <p><strong>Email:</strong> {invoice.customer_email}</p>
          <p><strong>Phone:</strong> {invoice.customer_phone}</p>
          <p><strong>Address:</strong> {invoice.address}</p>
          <p><strong>Customer Description:</strong><br /> {invoice.customer_description}</p>
          <p><strong>Services:</strong><br />
            Wood Keep: {invoice.wood_keep ? 'Yes' : 'No'}<br />
            Stump Grinding: {invoice.stump_grinding ? 'Yes' : 'No'}
          </p>
          <p><strong>Total Amount:</strong> ${invoice.total_amount}</p>
          <p><strong>Due Date:</strong> {invoice.due_date}</p>
          <p><strong>Notes:</strong> {invoice.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
