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
export function getAddressSuggestions(query, trees, limit = 10) {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Map(); // Use Map to track priority

  trees.forEach(tree => {
    const districtKo = tree.location.district_ko;
    const districtEn = tree.location.district.toLowerCase();
    const neighborhood = tree.location.neighborhood.toLowerCase();
    const neighborhoodKo = tree.location.neighborhood;

    // Check if district matches (Korean or English)
    const districtStartsWithKo = districtKo.startsWith(query);
    const districtIncludesKo = districtKo.includes(query);
    const districtStartsWithEn = districtEn.startsWith(lowerQuery);
    const districtIncludesEn = districtEn.includes(lowerQuery);

    // Check if neighborhood matches
    const neighborhoodStartsWith = neighborhood.startsWith(lowerQuery);
    const neighborhoodIncludes = neighborhood.includes(lowerQuery);

    // Priority 1: Starts with query (highest priority)
    if (districtStartsWithKo && !suggestions.has(districtKo)) {
      suggestions.set(districtKo, { text: districtKo, priority: 1 });
    }

    // Priority 2: Neighborhood starts with query
    const neighborhoodText = `${neighborhoodKo}, ${districtKo}`;
    if (neighborhoodStartsWith && !suggestions.has(neighborhoodText)) {
      suggestions.set(neighborhoodText, { text: neighborhoodText, priority: 2 });
    }

    // Priority 3: District contains query
    if (districtIncludesKo && !suggestions.has(districtKo)) {
      suggestions.set(districtKo, { text: districtKo, priority: 3 });
    }

    // Priority 4: Neighborhood contains query
    if (neighborhoodIncludes && !suggestions.has(neighborhoodText)) {
      suggestions.set(neighborhoodText, { text: neighborhoodText, priority: 4 });
    }

    // Also check English matches
    if (districtStartsWithEn && !suggestions.has(districtKo)) {
      suggestions.set(districtKo, { text: districtKo, priority: 1 });
    }
    if (districtIncludesEn && !suggestions.has(districtKo)) {
      suggestions.set(districtKo, { text: districtKo, priority: 3 });
    }
  });

  // Sort by priority and return
  return Array.from(suggestions.values())
    .sort((a, b) => a.priority - b.priority)
    .map(item => item.text)
    .slice(0, limit);
}
