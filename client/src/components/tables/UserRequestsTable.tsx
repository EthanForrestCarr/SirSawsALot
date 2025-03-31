import React from 'react';
import WorkRequestButton from '../buttons/WorkRequestButton';

interface Request {
  id: number;
  date: string;
  first_name: string;
  last_name: string;
  address: string;
  status: string;
  // Assume the request data includes the invoice when submitted.
  invoice?: any;
}

interface UserRequestsTableProps {
  requests: Request[];
  onViewInvoice: (invoice: any) => void;
}

const UserRequestsTable: React.FC<UserRequestsTableProps> = ({ requests }) => {
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <WorkRequestButton /> {/* New: Work request button in dashboard */}
      </div>
      <table className="universal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Name</th>
            <th>Address</th>
            <th>Status</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{new Date(req.date).toLocaleString()}</td>
              <td>{req.first_name} {req.last_name}</td>
              <td>{req.address}</td>
              <td>{req.status}</td>
              <td>
                {req.invoice ? req.invoice.status : 'No Invoice'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserRequestsTable;