# Tree Map App - Detailed Plan

## Overview
A web application displaying an interactive map of Seoul with 500-1000 trees pinned throughout the city. Each tree has detailed metadata including health condition, species, physical characteristics, and photos.

## Technology Stack
- **Frontend**: React (with Vite)
- **Map Library**: Leaflet (open-source, no API key required)
- **Styling**: CSS modules or Tailwind CSS
- **State Management**: React Context or Zustand (lightweight)
- **Data**: Mock JSON data (500-1000 trees)

## Core Features

### 1. Interactive Map
- **Base Map**: Leaflet map centered on Seoul, South Korea
  - Initial coordinates: ~37.5665° N, 126.9780° E
  - Zoom level: 11-13 (city-wide view)
- **Tree Markers**: Custom tree icons on map
  - Color-coded by health condition (Green/Yellow/Orange/Red)
  - Cluster markers when zoomed out for performance
- **Map Controls**: Zoom, pan, reset to default view

### 2. Tree Pins & Metadata
Each tree includes the following data:
- **Identification**
  - Unique Tree ID
  - Species (common name and scientific name)
  - Address/Location
  - GPS Coordinates (lat/lng)

- **Physical Characteristics**
  - Height (in meters)
  - Trunk diameter (DBH - diameter at breast height)
  - Number of trunks
  - Canopy spread
  - Estimated age

- **Health & Condition (Detailed)**
  - Health Score (1-10)
  - Hazard Rating (None/Low/Medium/High/Critical)
  - Structural Condition (Excellent/Good/Fair/Poor/Failed)
  - Maintenance Needs (array: pruning, cabling, removal, etc.)
  - Last Inspection Date
  - Notes

- **Visual**
  - Primary photo URL
  - Additional photos (array)

### 3. Click Pin for Details
- Click any tree marker to open a detail panel
- Detail panel shows:
  - Tree photo carousel
  - All metadata organized in sections
  - Health visualization (progress bars, color indicators)
  - Location info with "Get Directions" option
- Panel can be sidebar (desktop) or bottom sheet (mobile)

### 4. Search by Address
- Search bar at top of map
- Autocomplete suggestions (mock addresses in Seoul)
- Search finds trees within radius of address
- Map pans and zooms to show search results
- Highlight matching trees

### 5. View Tree Photos
- Primary photo displayed on marker hover
- Full photo gallery in detail panel
- Lightbox view for enlarged photos
- Mock photos using placeholder images or tree stock photos

## Data Structure

### Tree Data Model
```json
{
  "id": "TREE-001",
  "species": {
    "common": "Korean Red Pine",
    "scientific": "Pinus densiflora"
  },
  "location": {
    "address": "123 Gangnam-daero, Gangnam-gu, Seoul",
    "coordinates": {
      "lat": 37.5172,
      "lng": 127.0473
    },
    "district": "Gangnam-gu",
    "neighborhood": "Apgujeong-dong"
  },
  "physical": {
    "height": 15.5,
    "dbh": 45,
    "trunks": 1,
    "canopySpread": 8.2,
    "estimatedAge": 35
  },
  "condition": {
    "healthScore": 8,
    "hazardRating": "Low",
    "structuralCondition": "Good",
    "maintenanceNeeds": ["Pruning"],
    "lastInspection": "2024-09-15",
    "notes": "Healthy specimen, minor deadwood in crown"
  },
  "photos": [
    "/images/trees/tree-001-main.jpg",
    "/images/trees/tree-001-trunk.jpg",
    "/images/trees/tree-001-canopy.jpg"
  ]
}
```

## File Structure
```
tree-map-app/
├── public/
│   └── images/
│       └── trees/          # Tree photos
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.jsx          # Main map component
│   │   │   ├── TreeMarker.jsx       # Individual tree marker
│   │   │   └── MarkerCluster.jsx    # Clustering logic
│   │   ├── TreeDetails/
│   │   │   ├── DetailPanel.jsx      # Slide-out panel
│   │   │   ├── PhotoGallery.jsx     # Photo carousel
│   │   │   ├── HealthMetrics.jsx    # Health visualization
│   │   │   └── TreeInfo.jsx         # Metadata display
│   │   ├── Search/
│   │   │   └── AddressSearch.jsx    # Search bar component
│   │   └── UI/
│   │       ├── Header.jsx
│   │       └── Legend.jsx           # Map legend
│   ├── data/
│   │   ├── trees.json               # Mock tree data (500-1000 trees)
│   │   └── generateTreeData.js      # Script to generate mock data
│   ├── utils/
│   │   ├── mapUtils.js              # Map helper functions
│   │   └── searchUtils.js           # Search/filter functions
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── PLAN.md (this file)
```

## Implementation Phases

### Phase 1: Setup & Basic Map
1. Initialize React project with Vite
2. Install dependencies:
   - `react-leaflet` (Leaflet wrapper for React)
   - `leaflet`
   - `leaflet.markercluster` (for clustering)
3. Create basic map component centered on Seoul
4. Add base tile layer (OpenStreetMap)

### Phase 2: Mock Data Generation
1. Write script to generate 500-1000 realistic trees
2. Distribute trees across Seoul districts
3. Assign realistic species common in Seoul
4. Generate varied health conditions and metadata
5. Create or source placeholder tree images

### Phase 3: Tree Markers
1. Display tree markers on map from data
2. Implement marker clustering for performance
3. Color-code markers by health condition
4. Add hover effects showing tree ID/species

### Phase 4: Detail Panel
1. Create detail panel component (responsive)
2. Implement click handler to open panel
3. Display all tree metadata
4. Add photo gallery with lightbox
5. Visualize health metrics with progress bars

### Phase 5: Search Functionality
1. Create search bar component
2. Implement address geocoding (mock for Seoul)
3. Filter trees by proximity to searched address
4. Pan/zoom map to search results
5. Highlight found trees

### Phase 6: Polish & UX
1. Add map legend
2. Implement responsive design
3. Add loading states
4. Optimize performance (lazy loading, memoization)
5. Add error boundaries

## Seoul-Specific Considerations

### Districts to Include
- Gangnam-gu (강남구)
- Jongno-gu (종로구)
- Jung-gu (중구)
- Mapo-gu (마포구)
- Songpa-gu (송파구)
- Seocho-gu (서초구)
- And others (25 districts total)

### Common Tree Species in Seoul
- Korean Red Pine (Pinus densiflora)
- Ginkgo (Ginkgo biloba)
- Zelkova (Zelkova serrata)
- Korean Mountain Ash (Sorbus alnifolia)
- Cherry (Prunus serrulata)
- Maple (Acer palmatum)
- Metasequoia (Metasequoia glyptostroboides)

## Performance Considerations
- Use marker clustering to handle 500-1000 markers efficiently
- Lazy load tree details only when clicked
- Optimize images (compress, use WebP)
- Implement virtual scrolling for large datasets if needed
- Debounce search input

## Future Enhancements (Optional)
- Filter by species, health score, district
- Export tree data as CSV
- User authentication to submit tree updates
- Integration with support site for reporting issues
- Real-time updates with WebSocket
- Mobile app version
