import './StatusBadge.css';

export default function StatusBadge({ status }) {
  const statusClass = status === 'Submitted' ? 'status-submitted' : 'status-acknowledged';

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
}
