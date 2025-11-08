import { useState } from 'react';
import PhotoGallery from './PhotoGallery';
import HealthMetrics from './HealthMetrics';
import TreeInfo from './TreeInfo';
import './DetailPanel.css';

function DetailPanel({ tree, onClose, onRequestSupport }) {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <div className="header-title">
          <h2>{tree.species.common_ko}</h2>
          <p className="tree-id">{tree.id}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button className="request-support-button" onClick={onRequestSupport}>
        Request Support
      </button>

      <div className="detail-panel-content">
        {/* Photo Gallery */}
        <PhotoGallery photos={tree.photos} treeName={tree.species.common_ko} />

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Tree Info
          </button>
          <button
            className={`tab ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            Health & Condition
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'info' && <TreeInfo tree={tree} />}
          {activeTab === 'health' && <HealthMetrics tree={tree} />}
        </div>
      </div>
    </div>
  );
}

export default DetailPanel;
