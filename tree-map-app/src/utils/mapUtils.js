import L from 'leaflet';

// Get marker color based on health score
export function getMarkerColor(healthScore) {
  if (healthScore >= 8) return '#22c55e'; // Green - Excellent
  if (healthScore >= 6) return '#eab308'; // Yellow - Good
  if (healthScore >= 4) return '#f97316'; // Orange - Fair
  return '#ef4444'; // Red - Poor/Critical
}

// Create custom tree marker icon
export function createTreeIcon(healthScore, isHighlighted = false) {
  const color = getMarkerColor(healthScore);
  const size = isHighlighted ? 16 : 12;
  const opacity = isHighlighted ? 1 : 0.8;

  const svgIcon = `
    <svg width="${size * 2}" height="${size * 2}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" opacity="${opacity}" stroke="white" stroke-width="2"/>
      <path d="M12 8 L12 16 M8 12 L16 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'tree-marker',
    iconSize: [size * 2, size * 2],
    iconAnchor: [size, size],
    popupAnchor: [0, -size]
  });
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Get health condition label
export function getHealthConditionLabel(healthScore) {
  if (healthScore >= 9) return 'Excellent';
  if (healthScore >= 7) return 'Good';
  if (healthScore >= 5) return 'Fair';
  if (healthScore >= 3) return 'Poor';
  return 'Critical';
}

// Get hazard rating color
export function getHazardColor(hazardRating) {
  const colors = {
    'None': '#22c55e',
    'Low': '#84cc16',
    'Medium': '#eab308',
    'High': '#f97316',
    'Critical': '#ef4444'
  };
  return colors[hazardRating] || '#6b7280';
}
