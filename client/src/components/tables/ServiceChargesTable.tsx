import React from 'react';

interface ServiceChargesTableProps {
  invoice: any;
}

const ServiceChargesTable: React.FC<ServiceChargesTableProps> = ({ invoice }) => {
  // Extracted pricing logic
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
    <div>
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
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Service Type</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {invoice.service_type} ({invoice.job_scope})
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${servicePrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Stump Grinding</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {invoice.stump_grinding ? 'Stump grinding included' : 'No stump grinding'}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${stumpPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Wood Keep</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {invoice.wood_keep ? 'Customer keeps the wood' : 'Wood removal included'}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${woodKeepPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={2}>
              <strong>Discount ({invoice.discount || 0}%)</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              - ${discountValue.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={2}>
              <strong>Subtotal</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              <strong>${taxableAmount.toFixed(2)}</strong>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={2}>
              <strong>Tax (8%)</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              + ${tax.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }} colSpan={2}>
              <strong>Total</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              <strong>${finalTotal.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ServiceChargesTable;
