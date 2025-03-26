import React from 'react';
import "../../styles/Button.css";

interface GenerateInvoiceButtonProps {
  request: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    wood_keep?: boolean;
    stump_grinding?: boolean;
  };
  onOpenModal?: (prefillData: any) => void;
}

const GenerateInvoiceButton: React.FC<GenerateInvoiceButtonProps> = ({
  request,
  onOpenModal = () => {},
}) => {
  const handleGenerateInvoice = () => {
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const prefillData = {
      request_id: request.id.toString(),
      customer_first_name: request.first_name,
      customer_last_name: request.last_name,
      customer_email: request.email || '', // Populate if available
      customer_phone: request.phone || '',   // Populate if available
      address: request.address,
      customer_description: request.description, // renamed from work_description
      wood_keep: !!request.wood_keep,            // new field as boolean
      stump_grinding: !!request.stump_grinding,   // new field as boolean
      total_amount: '', // Removed default pricing value; InvoiceForm will calculate total.
      due_date: twoWeeksFromNow,
      notes: '',
    };

    console.log("GenerateInvoiceButton clicked; prefillData:", prefillData);
    onOpenModal(prefillData);
  };

  return (
    <button onClick={handleGenerateInvoice} className="btn-small">
      Generate Invoice
    </button>
  );
};

export default GenerateInvoiceButton;