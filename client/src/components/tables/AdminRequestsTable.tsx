import React from 'react';
import DetailsButton from '../buttons/DetailsButton';
import ApproveDenyButtons from '../buttons/ApproveDenyButtons';
import GenerateInvoiceButton from '../buttons/GenerateInvoiceButton';
import '../../styles/Table.css'; // added import

interface Request {
  id: number;
  date: string;
  first_name: string;
  last_name: string;
  description: string;
  address: string;
  status: string;
  wood_keep?: boolean;
  stump_grinding?: boolean;
  // Include any additional fields you want to pass to the invoice.
}

interface AdminRequestsTableProps {
  requests: Request[];
  currentPage: number;
  requestsPerPage: number;
  updateRequestStatus: (id: number, status: string) => void;
  onPrefill: (prefillData: any) => void;
  onOpenModal: (prefillData: any) => void; // Updated to accept prefillData
}

const AdminRequestsTable: React.FC<AdminRequestsTableProps> = ({
  requests,
  currentPage,
  requestsPerPage,
  updateRequestStatus,
  onOpenModal,
}) => {
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  console.log("AdminRequestsTable rendering; currentRequests:", currentRequests);

  return (
    <table className="universal-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Name</th>
          <th>Address</th>
          <th>Status</th>
          <th>Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((req) => (
          <tr key={req.id}>
            <td>{req.id}</td>
            <td>{new Date(req.date).toLocaleString()}</td>
            <td>{`${req.first_name} ${req.last_name}`}</td>
            <td>{req.address}</td>
            <td>{req.status}</td>
            <td>
              <DetailsButton requestId={req.id} />
            </td>
            <td>
              {req.status && (
                <ApproveDenyButtons requestId={req.id} updateRequestStatus={updateRequestStatus} />
              )}
              <GenerateInvoiceButton request={req} onOpenModal={onOpenModal} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminRequestsTable;
