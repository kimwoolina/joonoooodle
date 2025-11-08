import './EmergencyTypeSelect.css';

const EMERGENCY_TYPES = [
  {
    value: 'Fallen or Leaning Tree',
    label: 'Fallen or Leaning Tree',
    description: 'Trees that have fallen completely or are dangerously leaning',
    priority: 'High/Critical',
  },
  {
    value: 'Branch Hazard',
    label: 'Branch Hazard',
    description: 'Broken, hanging, or dead branches that pose danger',
    priority: 'Medium/High',
  },
  {
    value: 'Root Damage',
    label: 'Root Damage',
    description: 'Tree roots damaging sidewalks, foundations, or utilities',
    priority: 'Low/Medium',
  },
];

export default function EmergencyTypeSelect({ register, error }) {
  return (
    <div className="emergency-type-select">
      <label className="input-label">
        Emergency Type <span className="required">*</span>
      </label>
      <div className="emergency-options">
        {EMERGENCY_TYPES.map((type) => (
          <label key={type.value} className="emergency-option">
            <input
              type="radio"
              value={type.value}
              {...register('emergencyType')}
            />
            <div className="emergency-content">
              <div className="emergency-header">
                <span className="emergency-label">{type.label}</span>
                <span className="emergency-priority">{type.priority}</span>
              </div>
              <p className="emergency-description">{type.description}</p>
            </div>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
}
