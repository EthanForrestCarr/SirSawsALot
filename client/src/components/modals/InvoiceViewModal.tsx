import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

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
          fontFamily: 'Arial, sans-serif',
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

        {/* Add id="invoice-content" to the container */}
        <div id="invoice-content">
          {/* Step 1: Business Info */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {/* Add the logo */}
            <img
              src="/SirSawsalotLogo.png" // Update the path if necessary
              alt="Sir Sawsalot Logo"
              style={{ maxWidth: '150px', marginBottom: '1rem' }}
            />
            <h2>Sir Sawsalot</h2>
            <p>123 Business Street, Fergus Falls, MN, 12345</p>
            <p>Phone: (123) 456-7890 | Email: sirsawsalot@yahoo.com</p>
          </div>

          {/* Step 2: Client Info */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Bill To:</h3>
            <p>{invoice.customer_first_name} {invoice.customer_last_name}</p>
            <p>{invoice.address}</p>
            <p>Email: {invoice.customer_email}</p>
            <p>Phone: {invoice.customer_phone}</p>
          </div>

          {/* Step 3: Invoice Number */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Invoice Details:</h3>
            <p><strong>Invoice Number:</strong> {invoice.id}</p>
            <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {invoice.due_date}</p>
          </div>

          {/* Step 5: Service and Product Charges */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Services:</h3>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1rem',
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Service</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Wood Keep</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {invoice.wood_keep ? 'Customer keeps the wood' : 'Wood removal included'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${woodKeepPrice}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Stump Grinding</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {invoice.stump_grinding ? 'Stump grinding included' : 'No stump grinding'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${stumpPrice}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Service Type</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {invoice.service_type} ({invoice.job_scope})
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${servicePrice}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step 6: Total Amount */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Total Amount:</h3>
            <p><strong>${invoice.total_amount}</strong></p>
          </div>

          {/* Step 7: Notes Section */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>Notes:</h3>
            <p>{invoice.notes || 'No additional notes provided.'}</p>
          </div>

          {/* Step 8: Personal Touch */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>Thank you for your business!</p>
          </div>
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
