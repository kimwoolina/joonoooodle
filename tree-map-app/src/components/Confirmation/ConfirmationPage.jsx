import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../UI/Button';
import './ConfirmationPage.css';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state?.request;

  if (!request) {
    return (
      <div className="confirmation-container">
        <div className="error-state">
          <h1>No Request Found</h1>
          <p>Please submit a request first.</p>
          <Link to="/support">
            <Button variant="primary">Submit New Request</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Request Submitted Successfully!</h1>
        <p className="success-message">
          Your tree service request has been received and is being processed.
        </p>

        <div className="request-summary">
          <div className="summary-section highlight">
            <h3>Request ID</h3>
            <p className="request-id">{request.requestId}</p>
            <p className="id-note">Save this ID for your records</p>
          </div>

          <div className="summary-section">
            <h3>Emergency Type</h3>
            <p>{request.emergencyType}</p>
          </div>

          <div className="summary-section">
            <h3>Location</h3>
            <p>{request.location.address}</p>
            <p>{request.location.district}</p>
          </div>

          <div className="summary-section">
            <h3>Contact Information</h3>
            <p>{request.contact.name}</p>
            <p>{request.contact.email}</p>
            <p>{request.contact.phone}</p>
          </div>

          <div className="summary-section">
            <h3>Submitted</h3>
            <p>{formatDate(request.submittedAt)}</p>
          </div>
        </div>

        <div className="response-info">
          <h3>What's Next?</h3>
          <ul>
            <li>Your request has been logged in our system</li>
            <li>Our team will review and prioritize based on emergency type</li>
            <li>Estimated response time varies by priority level</li>
            <li>You will be contacted at the provided email or phone number</li>
          </ul>
        </div>

        <div className="confirmation-actions">
          <Button
            variant="primary"
            onClick={() => navigate('/support')}
          >
            Submit Another Request
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Back to Map
          </Button>
        </div>
      </div>
    </div>
  );
}
