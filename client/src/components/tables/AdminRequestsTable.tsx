import React from 'react';
import DetailsButton from '../buttons/DetailsButton';
import ApproveDenyButtons from '../buttons/ApproveDenyButtons';
import GenerateInvoiceButton from '../buttons/GenerateInvoiceButton';
import WorkRequestButton from '../buttons/WorkRequestButton';
import '../../styles/Table.css';

interface Request {
  id: number;
  date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  status: string;
  wood_keep?: boolean;
  stump_grinding?: boolean;
}

interface AdminRequestsTableProps {
  requests: Request[];
  currentPage: number;
  requestsPerPage: number;
  updateRequestStatus: (id: number, status: string) => void;
  onPrefill: (prefillData: any) => void;
  onOpenModal: (prefillData: any) => void;
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

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <WorkRequestButton />
      </div>
      <div className="responsive-table">
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
                <td data-label="ID">{req.id}</td>
                <td data-label="Date">{new Date(req.date).toLocaleString()}</td>
                <td data-label="Name">{`${req.first_name} ${req.last_name}`}</td>
                <td data-label="Address">{req.address}</td>
                <td data-label="Status">{req.status}</td>
                <td data-label="Details">
                  <DetailsButton requestId={req.id} />
                </td>
                <td data-label="Actions">
                  {req.status && (
                    <ApproveDenyButtons requestId={req.id} updateRequestStatus={updateRequestStatus} />
                  )}
                  <GenerateInvoiceButton request={req} onOpenModal={onOpenModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminRequestsTable;
