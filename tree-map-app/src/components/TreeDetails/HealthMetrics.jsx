import { getHealthConditionLabel, getHazardColor } from '../../utils/mapUtils';
import './HealthMetrics.css';

function HealthMetrics({ tree }) {
  const { condition } = tree;
  const healthPercentage = (condition.healthScore / 10) * 100;

  return (
    <div className="health-metrics">
      {/* Health Score */}
      <div className="metric-section">
        <h3>Overall Health Score</h3>
        <div className="health-score-display">
          <div className="score-circle">
            <span className="score-number">{condition.healthScore}</span>
            <span className="score-max">/10</span>
          </div>
          <div className="score-label">{getHealthConditionLabel(condition.healthScore)}</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${healthPercentage}%`,
              backgroundColor: getHealthScoreColor(condition.healthScore)
            }}
          />
        </div>
      </div>

      {/* Structural Condition */}
      <div className="metric-section">
        <h3>Structural Condition</h3>
        <div className="condition-badge">
          {condition.structuralCondition}
        </div>
      </div>

      {/* Hazard Rating */}
      <div className="metric-section">
        <h3>Hazard Rating</h3>
        <div
          className="hazard-badge"
          style={{ backgroundColor: getHazardColor(condition.hazardRating) }}
        >
          {condition.hazardRating}
        </div>
      </div>

      {/* Maintenance Needs */}
      <div className="metric-section">
        <h3>Maintenance Needs</h3>
        {condition.maintenanceNeeds.length > 0 ? (
          <div className="maintenance-list">
            {condition.maintenanceNeeds.map((need, index) => (
              <span key={index} className="maintenance-tag">
                {need}
              </span>
            ))}
          </div>
        ) : (
          <p className="no-maintenance">No maintenance required</p>
        )}
      </div>

      {/* Last Inspection */}
      <div className="metric-section">
        <h3>Last Inspection</h3>
        <p className="inspection-date">{formatDate(condition.lastInspection)}</p>
      </div>

      {/* Notes */}
      <div className="metric-section">
        <h3>Inspection Notes</h3>
        <p className="notes">{condition.notes}</p>
      </div>
    </div>
  );
}

function getHealthScoreColor(score) {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#eab308';
  if (score >= 4) return '#f97316';
  return '#ef4444';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default HealthMetrics;
