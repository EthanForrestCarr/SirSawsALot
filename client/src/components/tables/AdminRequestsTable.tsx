import React from 'react';
import DetailsButton from '../buttons/DetailsButton';
import ApproveDenyButtons from '../buttons/ApproveDenyButtons';

interface Request {
  id: number;
  date: string;
  name: string;
  description: string;
  address: string;
  status: string;
}

interface AdminRequestsTableProps {
  requests: Request[];
  currentPage: number;
  requestsPerPage: number;
  updateRequestStatus: (id: number, status: string) => void;
}

const AdminRequestsTable: React.FC<AdminRequestsTableProps> = ({
  requests,
  currentPage,
  requestsPerPage,
  updateRequestStatus,
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
          <th>Description</th>
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
            <td>{req.name}</td>
            <td>{req.description}</td>
            <td>{req.address}</td>
            <td>{req.status}</td>
            <td>
              <DetailsButton requestId={req.id} />
            </td>
            <td>
              {req.status && <ApproveDenyButtons requestId={req.id} updateRequestStatus={updateRequestStatus} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminRequestsTable;
