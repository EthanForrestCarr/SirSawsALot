import React from 'react';
import '../../styles/Table.css';

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
    <div className="responsive-table">
      <table className="universal-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Service">Service Type</td>
            <td data-label="Description">
              {invoice.service_type} ({invoice.job_scope})
            </td>
            <td data-label="Price">${servicePrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td data-label="Service">Stump Grinding</td>
            <td data-label="Description">
              {invoice.stump_grinding ? 'Stump grinding included' : 'No stump grinding'}
            </td>
            <td data-label="Price">${stumpPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td data-label="Service">Wood Keep</td>
            <td data-label="Description">
              {invoice.wood_keep ? 'Customer keeps the wood' : 'Wood removal included'}
            </td>
            <td data-label="Price">${woodKeepPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td data-label="Discount" colSpan={2}>
              <strong>Discount ({invoice.discount || 0}%)</strong>
            </td>
            <td data-label="Price">- ${discountValue.toFixed(2)}</td>
          </tr>
          <tr>
            <td data-label="Subtotal" colSpan={2}>
              <strong>Subtotal</strong>
            </td>
            <td data-label="Price">
              <strong>${taxableAmount.toFixed(2)}</strong>
            </td>
          </tr>
          <tr>
            <td data-label="Tax" colSpan={2}>
              <strong>Tax (8%)</strong>
            </td>
            <td data-label="Price">+ ${tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td data-label="Total" colSpan={2}>
              <strong>Total</strong>
            </td>
            <td data-label="Price">
              <strong>${finalTotal.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ServiceChargesTable;
