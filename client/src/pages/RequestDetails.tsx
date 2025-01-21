import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get request ID from URL
  const [request, setRequest] = useState<any>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/admin/requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequest(response.data);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch request details.');
      }
    };

    fetchRequestDetails();
  }, [id]);

  if (!request) {
    return <div>{message || 'Loading...'}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Request Details</h2>
      <p><strong>ID:</strong> {request.id}</p>
      <p><strong>Description:</strong> {request.description}</p>
      <p><strong>Address:</strong> {request.address}</p>
      <p><strong>Status:</strong> {request.status}</p>
      <p><strong>Keep the Wood:</strong> {request.wood_keep ? 'Yes' : 'No'}</p>
      {request.wood_keep && (
        <p><strong>Wood Arrangement:</strong> {request.wood_arrangement}</p>
      )}
      <p><strong>Stump Grinding:</strong> {request.stump_grinding ? 'Yes' : 'No'}</p>
      <p><strong>Branch Height:</strong> {request.branch_height} ft</p>
      <p><strong>Images:</strong></p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {request.images && request.images.map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Request Image ${index + 1}`}
            style={{ maxWidth: '200px', borderRadius: '8px' }}
          />
        ))}
      </div>
      <button
        onClick={() => navigate('/admin/dashboard')}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default RequestDetailsPage;
