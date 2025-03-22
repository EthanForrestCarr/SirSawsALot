import React from 'react';

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
    // Add any extra fields if needed
  };
  onOpenModal?: (prefillData: any) => void;
}

const GenerateInvoiceButton: React.FC<GenerateInvoiceButtonProps> = ({
  request,
  onOpenModal = () => {},
}) => {
  const handleGenerateInvoice = () => {
    const prefillData = {
      request_id: request.id.toString(),
      customer_first_name: request.first_name,
      customer_last_name: request.last_name,
      customer_email: request.email || '', // Populate if available
      customer_phone: request.phone || '', // Populate if available
      address: request.address,
      customer_description: request.description, // renamed from work_description
      wood_keep: !!request.wood_keep,            // new field as boolean
      stump_grinding: !!request.stump_grinding,   // new field as boolean
      total_amount: '100', // Default pricing value; update or calculate as needed
      due_date: new Date().toISOString().split('T')[0],
      notes: '',
    };

    console.log("GenerateInvoiceButton clicked; prefillData:", prefillData);
    onOpenModal(prefillData);
  };

  return (
    <button
      onClick={handleGenerateInvoice}
      style={{ padding: '5px 10px', margin: '0.2rem' }}
    >
      Generate Invoice
    </button>
  );
};

export default GenerateInvoiceButton;