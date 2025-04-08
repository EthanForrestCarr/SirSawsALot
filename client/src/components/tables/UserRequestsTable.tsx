import React from 'react';
import WorkRequestButton from '../buttons/WorkRequestButton';

interface Request {
  id: number;
  date: string;
  first_name: string;
  last_name: string;
  address: string;
  status: string;
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
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td data-label="ID">{req.id}</td>
                <td data-label="Date">{new Date(req.date).toLocaleString()}</td>
                <td data-label="Name">{req.first_name} {req.last_name}</td>
                <td data-label="Address">{req.address}</td>
                <td data-label="Status">{req.status}</td>
                <td data-label="Invoice">
                  {req.invoice ? req.invoice.status : 'No Invoice'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserRequestsTable;