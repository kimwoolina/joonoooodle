# Seoul Tree Map 🌳

An interactive web application displaying 700 trees across Seoul, South Korea with detailed metadata including health conditions, species information, physical characteristics, and photos.

![Seoul Tree Map](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80)

## Features

- **Interactive Map**: Leaflet-based map centered on Seoul with 700+ tree markers
- **Tree Markers**: Color-coded by health condition (Green/Yellow/Orange/Red)
- **Marker Clustering**: Efficient clustering for better performance
- **Tree Details**: Comprehensive information panel for each tree
  - Species information (Korean name, common name, scientific name)
  - Physical characteristics (height, trunk diameter, age, canopy spread)
  - Health metrics with visual indicators
  - Photo gallery with lightbox view
- **Address Search**: Search trees by district, neighborhood, or address with autocomplete
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Map Library**: Leaflet + React-Leaflet
- **Marker Clustering**: react-leaflet-cluster
- **Styling**: CSS Modules

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd tree-map-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate mock tree data (already done):
   ```bash
   npm run generate-data
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

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
│   │   ├── TreeDetails/
│   │   │   ├── DetailPanel.jsx      # Slide-out detail panel
│   │   │   ├── PhotoGallery.jsx     # Photo carousel
│   │   │   ├── HealthMetrics.jsx    # Health visualization
│   │   │   └── TreeInfo.jsx         # Metadata display
│   │   ├── Search/
│   │   │   └── AddressSearch.jsx    # Search bar component
│   │   └── UI/
│   │       ├── Header.jsx           # App header
│   │       └── Legend.jsx           # Map legend
│   ├── data/
│   │   ├── trees.json               # Mock tree data (700 trees)
│   │   └── generateTreeData.js      # Data generation script
│   ├── utils/
│   │   ├── mapUtils.js              # Map helper functions
│   │   └── searchUtils.js           # Search/filter functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Data Model

Each tree contains the following information:

```json
{
  "id": "TREE-0001",
  "species": {
    "common": "Korean Red Pine",
    "common_ko": "소나무",
    "scientific": "Pinus densiflora"
  },
  "location": {
    "address": "123 Gangnam-gu, Seoul",
    "coordinates": { "lat": 37.5172, "lng": 127.0473 },
    "district": "Gangnam-gu",
    "district_ko": "강남구",
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
  "photos": [...]
}
```

## Health Condition Color Coding

- 🟢 **Green (9-10)**: Excellent health
- 🟡 **Yellow (7-8)**: Good health
- 🟠 **Orange (5-6)**: Fair health
- 🔴 **Red (1-4)**: Poor/Critical health

## Seoul Districts Covered

The app includes trees from all 25 districts of Seoul:
- Gangnam-gu (강남구)
- Jongno-gu (종로구)
- Jung-gu (중구)
- Mapo-gu (마포구)
- Songpa-gu (송파구)
- Seocho-gu (서초구)
- And 19 more districts...

## Common Tree Species

- Korean Red Pine (소나무)
- Ginkgo (은행나무)
- Zelkova (느티나무)
- Korean Mountain Ash (마가목)
- Cherry (벚나무)
- Japanese Maple (단풍나무)
- Dawn Redwood (메타세쿼이아)
- Korean Oak (참나무)
- And more...

## Usage

1. **View Trees**: The map displays all 700 trees across Seoul with color-coded markers
2. **Click a Tree**: Click any marker to see a popup with basic information
3. **View Details**: Click "View Details" in the popup to open the comprehensive detail panel
4. **Browse Photos**: Navigate through tree photos using the gallery controls
5. **Search**: Use the search bar to find trees by district, neighborhood, or address
6. **Toggle Legend**: Click the legend to expand/collapse the health condition guide

## Performance Optimizations

- Marker clustering for efficient rendering of 700+ markers
- Lazy loading of tree details
- Optimized images from Unsplash CDN
- Responsive design for mobile and desktop

## Future Enhancements

- Filter by species, health score, or district
- Export tree data as CSV
- User authentication for submitting tree updates
- Integration with tree maintenance reporting
- Real-time updates
- Mobile app version

## License

This project is for educational and demonstration purposes.

## Credits

- Map tiles: OpenStreetMap
- Photos: Unsplash
- Icons: Custom SVG icons
