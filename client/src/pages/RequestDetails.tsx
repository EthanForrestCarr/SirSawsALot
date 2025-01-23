import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get request ID from URL
  const [request, setRequest] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
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
        setFormData(response.data); // Initialize form data
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Failed to fetch request details.');
      }
    };

    fetchRequestDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/requests/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequest(response.data);
      setIsEditing(false);
      setMessage('Request updated successfully.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update request.');
    }
  };

  if (!request) {
    return <div>{message || 'Loading...'}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Request Details</h2>
      {message && <p>{message}</p>}
      <p><strong>ID:</strong> {request.id}</p>
      {isEditing ? (
        <>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: '100%', height: '80px', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label>Keep the Wood:</label>
            <input
              type="checkbox"
              name="wood_keep"
              checked={formData.wood_keep}
              onChange={handleInputChange}
            />
          </div>
          {formData.wood_keep && (
            <div>
              <label>Wood Arrangement:</label>
              <input
                type="text"
                name="wood_arrangement"
                value={formData.wood_arrangement}
                onChange={handleInputChange}
                style={{ width: '100%', marginBottom: '1rem' }}
              />
            </div>
          )}
          <div>
            <label>Grind the Stump:</label>
            <input
              type="checkbox"
              name="stump_grinding"
              checked={formData.stump_grinding}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Branch Height (feet):</label>
            <input
              type="number"
              name="branch_height"
              value={formData.branch_height}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          </div>
          <button onClick={handleSave} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
            Save
          </button>
          <button onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p><strong>Description:</strong> {request.description}</p>
          <p><strong>Address:</strong> {request.address}</p>
          <p><strong>Keep the Wood:</strong> {request.wood_keep ? 'Yes' : 'No'}</p>
          {request.wood_keep && <p><strong>Wood Arrangement:</strong> {request.wood_arrangement}</p>}
          <p><strong>Grind the Stump:</strong> {request.stump_grinding ? 'Yes' : 'No'}</p>
          <p><strong>Branch Height:</strong> {request.branch_height} ft</p>
          <button onClick={() => setIsEditing(true)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Edit
          </button>
        </>
      )}
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
