import React from 'react';
import DetailsButton from '../buttons/DetailsButton';
import ApproveDenyButtons from '../buttons/ApproveDenyButtons';
import GenerateInvoiceButton from '../buttons/GenerateInvoiceButton';

interface Request {
  id: number;
  date: string;
  first_name: string; // Added first_name field
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
  onInvoiceCreated?: () => void;
}

const AdminRequestsTable: React.FC<AdminRequestsTableProps> = ({
  requests,
  currentPage,
  requestsPerPage,
  updateRequestStatus,
  onInvoiceCreated = () => {},
}) => {
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
              <GenerateInvoiceButton request={req} onInvoiceCreated={onInvoiceCreated} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminRequestsTable;
