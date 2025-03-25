import React from 'react';
import InvoiceForm, { InvoiceFormData } from '../forms/InvoiceForm';
import CloseButton from '../buttons/CloseButton';
import '../../styles/Modal.css'; // use modal style sheet

interface InvoiceModalProps {
  open: boolean;
  initialData?: InvoiceFormData;
  onClose: () => void;
  onUpdate: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, initialData, onClose, onUpdate }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <CloseButton onClick={onClose} />
        <h3 style={{ textAlign: "center" }}>Create/Edit Invoice</h3>
        <InvoiceForm onUpdate={() => { onUpdate(); onClose(); }} initialData={initialData} />
      </div>
    </div>
  );
};

export default InvoiceModal;