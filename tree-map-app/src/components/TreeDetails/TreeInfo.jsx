import './TreeInfo.css';

function TreeInfo({ tree }) {
  return (
    <div className="tree-info">
      {/* Species Information */}
      <div className="info-section">
        <h3>Species Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Korean Name</span>
            <span className="info-value">{tree.species.common_ko}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Common Name</span>
            <span className="info-value">{tree.species.common}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Scientific Name</span>
            <span className="info-value scientific">{tree.species.scientific}</span>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="info-section">
        <h3>Location</h3>
        <div className="info-grid">
          <div className="info-item full-width">
            <span className="info-label">Address</span>
            <span className="info-value">{tree.location.address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">District</span>
            <span className="info-value">{tree.location.district_ko}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Neighborhood</span>
            <span className="info-value">{tree.location.neighborhood}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Latitude</span>
            <span className="info-value mono">{tree.location.coordinates.lat.toFixed(6)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Longitude</span>
            <span className="info-value mono">{tree.location.coordinates.lng.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Physical Characteristics */}
      <div className="info-section">
        <h3>Physical Characteristics</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Height</span>
            <span className="info-value">{tree.physical.height} m</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trunk Diameter (DBH)</span>
            <span className="info-value">{tree.physical.dbh} cm</span>
          </div>
          <div className="info-item">
            <span className="info-label">Number of Trunks</span>
            <span className="info-value">{tree.physical.trunks}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Canopy Spread</span>
            <span className="info-value">{tree.physical.canopySpread} m</span>
          </div>
          <div className="info-item">
            <span className="info-label">Estimated Age</span>
            <span className="info-value">{tree.physical.estimatedAge} years</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="info-section">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌳</div>
            <div className="stat-content">
              <div className="stat-label">Tree ID</div>
              <div className="stat-value">{tree.id}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-content">
              <div className="stat-label">Height</div>
              <div className="stat-value">{tree.physical.height}m</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎂</div>
            <div className="stat-content">
              <div className="stat-label">Age</div>
              <div className="stat-value">{tree.physical.estimatedAge}y</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💚</div>
            <div className="stat-content">
              <div className="stat-label">Health</div>
              <div className="stat-value">{tree.condition.healthScore}/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreeInfo;
