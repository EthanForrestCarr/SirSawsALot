import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import NameInput from '../components/inputs/NameInput';
import PhoneInput from '../components/inputs/PhoneInput';
import DescriptionInput from '../components/inputs/DescriptionInput';
import ImageInput from '../components/inputs/ImageInput';
import BranchHeightInput from '../components/inputs/BranchHeightInput';
import StumpGrindingInput from '../components/inputs/StumpGrindingInput';
import WoodPreferenceInput from '../components/inputs/WoodPreferenceInput';
import CancelButton from '../components/buttons/CancelButton';
import EditButton from '../components/buttons/EditButton'; // new import

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get request ID from URL
  const [request, setRequest] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await api.get(`/admin/requests/${id}`);
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
    console.log('Saving request with data:', formData); // Log the form data being sent
    try {
      const response = await api.put(`/admin/requests/${id}`, formData);
      console.log('Response from server:', response.data); // Log the response from the server
      setRequest(response.data);
      setIsEditing(false);
      setMessage('Request updated successfully.');
    } catch (error: any) {
      console.error('Error updating request:', error.response?.data?.message || error.message); // Log the error
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
          <NameInput formData={formData} handleChange={handleInputChange} />
          <PhoneInput formData={formData} handleChange={handleInputChange} />
          <DescriptionInput formData={formData} handleChange={handleInputChange} />
          <ImageInput formData={formData} handleChange={handleInputChange} />
          <BranchHeightInput formData={formData} handleChange={handleInputChange} />
          <WoodPreferenceInput formData={formData} handleChange={handleInputChange} />
          <StumpGrindingInput formData={formData} handleChange={handleInputChange} />

          <button onClick={handleSave} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
            Save
          </button>
          <CancelButton onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem' }} />
        </>
      ) : (
        <>
          <p><strong>First Name:</strong> {request.first_name}</p>
          <p><strong>Last Name:</strong> {request.last_name}</p>
          <p><strong>Address:</strong> {request.address}</p>
          <p><strong>Phone:</strong> {request.phone}</p>
          <p><strong>Description:</strong> {request.description}</p>
          <p><strong>Keep the Wood:</strong> {request.wood_keep ? 'Yes' : 'No'}</p>
          {request.wood_keep && <p><strong>Wood Arrangement:</strong> {request.wood_arrangement}</p>}
          <p><strong>Grind the Stump:</strong> {request.stump_grinding ? 'Yes' : 'No'}</p>
          <p><strong>Branch Height:</strong> {request.branch_height} ft</p>
          {request.images && (
            <div>
              <h3>Attached Image:</h3>
              <img
                src={`data:image/jpeg;base64,${request.images}`}
                alt="Work Request"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}
          <EditButton onClick={() => setIsEditing(true)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }} />
        </>
      )}
      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default RequestDetailsPage;