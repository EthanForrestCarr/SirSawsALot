import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceViewModalProps {
  invoice: any;
  onClose: () => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    // Add a custom class for PDF styling
    element.classList.add('pdf-style');

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.id}.pdf`);
    } finally {
      // Remove the custom class after generating the PDF
      element.classList.remove('pdf-style');
    }
  };

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
        <div id="invoice-content">
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
        <button
          onClick={handleDownloadPDF}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
