import { Marker, Popup } from 'react-leaflet';
import { createTreeIcon } from '../../utils/mapUtils';
import './TreeMarker.css';

function TreeMarker({ tree, onClick, isHighlighted }) {
  const icon = createTreeIcon(tree.condition.healthScore, isHighlighted);
  const position = [tree.location.coordinates.lat, tree.location.coordinates.lng];

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => onClick(tree),
      }}
    >
      <Popup>
        <div className="tree-popup">
          <h3>{tree.species.common_ko}</h3>
          <p className="species-name">{tree.species.common}</p>
          <p className="scientific-name">{tree.species.scientific}</p>
          <div className="popup-details">
            <p><strong>Tree ID:</strong> {tree.id}</p>
            <p><strong>Health Score:</strong> {tree.condition.healthScore}/10</p>
            <p><strong>Location:</strong> {tree.location.district_ko}</p>
          </div>
          <button className="details-button" onClick={() => onClick(tree)}>
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default TreeMarker;
