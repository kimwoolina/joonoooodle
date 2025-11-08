import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import RequestCard from './RequestCard';
import './RequestList.css';

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getAllRequests();
      setRequests(response.requests);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  if (loading) {
    return (
      <div className="request-list-container">
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-list-container">
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={fetchRequests} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-list-container">
      <div className="list-header">
        <h1>Service Requests</h1>
        <div className="request-count">
          Total: <strong>{requests.length}</strong> request{requests.length !== 1 ? 's' : ''}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🌳</span>
          <h2>No requests yet</h2>
          <p>Service requests will appear here once submitted.</p>
        </div>
      ) : (
        <div className="request-list">
          {requests.map((request) => (
            <RequestCard
              key={request.requestId}
              request={request}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
