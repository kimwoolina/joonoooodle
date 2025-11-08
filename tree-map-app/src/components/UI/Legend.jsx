import { useState } from 'react';
import './Legend.css';

function Legend() {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems = [
    { color: '#22c55e', label: 'Excellent', range: '9-10' },
    { color: '#eab308', label: 'Good', range: '7-8' },
    { color: '#f97316', label: 'Fair', range: '5-6' },
    { color: '#ef4444', label: 'Poor/Critical', range: '1-4' },
  ];

  return (
    <div className={`legend ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="legend-header">
        <h3>Tree Health</h3>
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse legend' : 'Expand legend'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="legend-items">
          {legendItems.map((item, index) => (
            <div key={index} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: item.color }}
              />
              <div className="legend-text">
                <span className="legend-label">{item.label}</span>
                <span className="legend-range">({item.range})</span>
              </div>
            </div>
          ))}
          <div className="legend-footer">
            <p>Health Score Scale: 1-10</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Legend;
