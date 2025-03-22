import React from 'react';
import InvoiceForm, { InvoiceFormData } from '../forms/InvoiceForm';

interface InvoiceModalProps {
  open: boolean;
  initialData?: InvoiceFormData;
  onClose: () => void;
  onUpdate: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ open, initialData, onClose, onUpdate }) => {
  console.log("InvoiceModal rendering; open:", open, "initialData:", initialData);
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "grey",
          padding: "1rem",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "600px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "transparent",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h3 style={{ textAlign: "center" }}>Create/Edit Invoice</h3>
        <InvoiceForm onUpdate={() => { onUpdate(); onClose(); }} initialData={initialData} />
      </div>
    </div>
  );
};

export default InvoiceModal;