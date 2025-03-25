import React from 'react';
import ServiceChargesTable from '../tables/ServiceChargesTable';
import DownloadPDFButton from '../buttons/DownloadPDFButton';
import CloseButton from '../buttons/CloseButton';
import '../../styles/Modal.css';

interface InvoiceViewModalProps {
  invoice: any;
  onClose: () => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  // Calculate individual service prices based on invoice data.
  const woodKeepPrice = invoice.wood_keep ? 0 : 50;
  const stumpPrice = invoice.stump_grinding ? 100 : 0;

  let baseServicePrice = 0;
  switch (invoice.service_type) {
    case "Just a trim":
      baseServicePrice = 100;
      break;
    case "Branch Removal":
      baseServicePrice = 200;
      break;
    case "Full Tree Service":
      baseServicePrice = 400;
      break;
    default:
      baseServicePrice = 0;
  }
  let scopeAdjustment = 0;
  if (invoice.job_scope === "small") {
    scopeAdjustment = -50;
  } else if (invoice.job_scope === "large") {
    scopeAdjustment = 50;
  }
  const servicePrice = baseServicePrice + scopeAdjustment;

  const subtotal = woodKeepPrice + stumpPrice + servicePrice;
  const discountValue = subtotal * ((invoice.discount || 0) / 100);
  const taxableAmount = subtotal - discountValue;
  const tax = taxableAmount * 0.08;
  const finalTotal = taxableAmount + tax;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <CloseButton onClick={onClose} />

        {/* Add id="invoice-content" to the container */}
        <div id="invoice-content" className="invoice-content">
          {/* Updated Business Info Section */}
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2>Sir Sawsalot</h2>
              <p>123 Business Street, Fergus Falls, MN, 12345</p>
              <p>Phone: (123) 456-7890 | Email: sirsawsalot@yahoo.com</p>
            </div>
            <img
              src="/SirSawsalotLogo.png"
              alt="Sir Sawsalot Logo"
              style={{ maxWidth: '150px' }}
            />
          </div>

          {/* Replace the separate Client Info and Invoice Details blocks with the following */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <h3>Bill To:</h3>
              <p>{invoice.customer_first_name} {invoice.customer_last_name}</p>
              <p>{invoice.address}</p>
              <p>Email: {invoice.customer_email}</p>
              <p>Phone: {invoice.customer_phone}</p>
            </div>
            <div style={{ flex: 1 }}>
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Number:</strong> {invoice.id}</p>
              <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString("en-US")}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString("en-US")}</p>
              <p><strong>Payments Made To:</strong> Sir Sawsalot</p>
            </div>
          </div>

          {/* Step 5: Service and Product Charges */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Services:</h3>
            <ServiceChargesTable invoice={invoice} />
          </div>

          {/* Step 7: Notes Section */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Notes:</h3>
            <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {invoice.notes || 'No additional notes provided.'}
            </p>
          </div>

          {/* Step 6: Amount Due */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Amount Due:</h3>
            <p><strong>${finalTotal.toFixed(2)}</strong></p>
          </div>

          {/* Step 8: Personal Touch */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>Thank you for your business!</p>
          </div>
        </div>

        <DownloadPDFButton invoice={invoice} />
      </div>
    </div>
  );
};

export default InvoiceViewModal;
