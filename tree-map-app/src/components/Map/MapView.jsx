import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import TreeMarker from './TreeMarker';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Component to update map center and zoom
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function MapView({ trees, onTreeClick, searchResults, center, zoom }) {
  const mapRef = useRef(null);

  // Determine which trees to highlight
  const highlightedIds = new Set(searchResults.map(tree => tree.id));

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        className="leaflet-map"
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapController center={center} zoom={zoom} />

        {/* Base map tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tree markers with clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {trees.map(tree => (
            <TreeMarker
              key={tree.id}
              tree={tree}
              onClick={() => onTreeClick(tree)}
              isHighlighted={highlightedIds.has(tree.id)}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default MapView;
