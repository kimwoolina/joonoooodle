import { calculateDistance } from './mapUtils';

// Mock geocoding - convert address to coordinates
export function geocodeAddress(address, trees) {
  const lowerAddress = address.toLowerCase();

  // Find trees that match the address
  const matchingTrees = trees.filter(tree => {
    const treeAddress = tree.location.address.toLowerCase();
    const district = tree.location.district.toLowerCase();
    const districtKo = tree.location.district_ko;
    const neighborhood = tree.location.neighborhood.toLowerCase();

    return treeAddress.includes(lowerAddress) ||
           district.includes(lowerAddress) ||
           districtKo.includes(address) ||
           neighborhood.includes(lowerAddress);
  });

  if (matchingTrees.length > 0) {
    // Return center of first matching tree
    const firstTree = matchingTrees[0];
    return {
      lat: firstTree.location.coordinates.lat,
      lng: firstTree.location.coordinates.lng
    };
  }

  return null;
}

// Find trees within radius of a location
export function findTreesNearLocation(trees, lat, lng, radiusKm = 1) {
  return trees.filter(tree => {
    const distance = calculateDistance(
      lat,
      lng,
      tree.location.coordinates.lat,
      tree.location.coordinates.lng
    );
    return distance <= radiusKm;
  });
}

// Filter trees by various criteria
export function filterTrees(trees, filters) {
  let filtered = [...trees];

  if (filters.species) {
    filtered = filtered.filter(tree =>
      tree.species.common.toLowerCase().includes(filters.species.toLowerCase()) ||
      tree.species.common_ko.includes(filters.species)
    );
  }

  if (filters.district) {
    filtered = filtered.filter(tree =>
      tree.location.district.toLowerCase().includes(filters.district.toLowerCase()) ||
      tree.location.district_ko.includes(filters.district)
    );
  }

  if (filters.minHealthScore !== undefined) {
    filtered = filtered.filter(tree => tree.condition.healthScore >= filters.minHealthScore);
  }

  if (filters.maxHealthScore !== undefined) {
    filtered = filtered.filter(tree => tree.condition.healthScore <= filters.maxHealthScore);
  }

  if (filters.hazardRating) {
    filtered = filtered.filter(tree => tree.condition.hazardRating === filters.hazardRating);
  }

  return filtered;
}

// Get autocomplete suggestions for addresses
export function getAddressSuggestions(query, trees, limit = 5) {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set();

  trees.forEach(tree => {
    // Add district suggestions
    if (tree.location.district.toLowerCase().includes(lowerQuery) ||
        tree.location.district_ko.includes(query)) {
      suggestions.add(tree.location.district_ko);
    }

    // Add neighborhood suggestions
    if (tree.location.neighborhood.toLowerCase().includes(lowerQuery)) {
      suggestions.add(`${tree.location.neighborhood}, ${tree.location.district_ko}`);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
