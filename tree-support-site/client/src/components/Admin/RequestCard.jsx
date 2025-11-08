import { useState } from 'react';
import { api } from '../../services/api';
import StatusBadge from './StatusBadge';
import Button from '../UI/Button';
import './RequestCard.css';

export default function RequestCard({ request, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = request.status === 'Submitted' ? 'Acknowledged' : 'Submitted';
    setIsUpdating(true);

    try {
      await api.updateRequestStatus(request.requestId, newStatus);
      onStatusUpdate(request.requestId, newStatus);
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="request-card">
      <div className="card-header">
        <div className="card-title">
          <span className="request-id">{request.requestId}</span>
          <StatusBadge status={request.status} />
        </div>
        <div className="emergency-type">{request.emergencyType}</div>
      </div>

      <div className="card-body">
        <div className="info-section">
          <h4>Contact</h4>
          <p><strong>Name:</strong> {request.contact.name}</p>
          <p><strong>Email:</strong> {request.contact.email}</p>
          <p><strong>Phone:</strong> {request.contact.phone}</p>
        </div>

        <div className="info-section">
          <h4>Location</h4>
          <p><strong>Address:</strong> {request.location.address}</p>
          <p><strong>District:</strong> {request.location.district}</p>
          {request.location.crossStreets && (
            <p><strong>Cross Streets:</strong> {request.location.crossStreets}</p>
          )}
          {request.location.landmarks && (
            <p><strong>Landmarks:</strong> {request.location.landmarks}</p>
          )}
        </div>

        {request.description && (
          <div className="info-section">
            <h4>Description</h4>
            <p>{request.description}</p>
          </div>
        )}

        <div className="card-footer">
          <span className="submit-date">
            Submitted: {formatDate(request.submittedAt)}
          </span>
          <Button
            variant="secondary"
            onClick={handleToggleStatus}
            disabled={isUpdating}
          >
            {isUpdating
              ? 'Updating...'
              : request.status === 'Submitted'
              ? 'Mark as Acknowledged'
              : 'Mark as Submitted'}
          </Button>
        </div>
      </div>
    </div>
  );
}
