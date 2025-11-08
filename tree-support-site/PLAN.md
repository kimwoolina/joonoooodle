# Tree Support Site - Detailed Plan

## Overview
A customer support website where users can submit service requests about tree emergencies. The site handles reports of fallen/leaning trees, branch hazards, and root damage. This site operates independently from the map app (no direct integration).

## Technology Stack
- **Frontend**: React (with Vite)
- **Backend**: Node.js + Express
- **Database**: JSON file storage (or SQLite for simplicity)
- **Styling**: CSS modules or Tailwind CSS
- **Form Handling**: React Hook Form + validation
- **API**: RESTful API

## Core Features

### 1. Service Request Submission Form
Users can submit emergency tree service requests with:

#### Emergency Types (Pre-selected categories)
- Fallen or Leaning Tree
- Branch Hazard
- Root Damage

#### Required Information
- **Fake Contact Information**
  - Name (auto-generated or user-provided fake name)
  - Email (fake email format)
  - Phone (fake phone number format)
  - Note: Emphasize this is demo/testing data

- **Location Details**
  - Street Address
  - Cross Streets (optional)
  - District/Neighborhood
  - GPS Coordinates (optional - can click map to select)
  - Landmarks or special instructions

#### Form Fields Structure
```javascript
{
  requestId: "REQ-2024-001",
  emergencyType: "Fallen or Leaning Tree",
  contact: {
    name: "Kim Min-jun (Demo)",
    email: "demo.user@example.com",
    phone: "010-1234-5678"
  },
  location: {
    address: "456 Teheran-ro, Gangnam-gu, Seoul",
    crossStreets: "Near intersection with Samseong-ro",
    district: "Gangnam-gu",
    coordinates: {
      lat: 37.5048,
      lng: 127.0498
    },
    landmarks: "Across from COEX Mall, near bus stop #23"
  },
  description: "Large tree leaning over sidewalk after storm",
  submittedAt: "2024-11-08T10:30:00Z",
  status: "Submitted"
}
```

### 2. Basic Admin View
- Simple read-only list of all submitted requests
- Table/card view showing:
  - Request ID
  - Emergency type
  - Location (address)
  - Contact name
  - Submission date/time
  - Status (Submitted/Acknowledged)
- Sortable by date
- No editing or assignment features (basic only)
- Simple status toggle (Submitted ↔ Acknowledged)

### 3. Request Confirmation
- After submission, show confirmation page with:
  - Request ID for reference
  - Summary of submitted information
  - Estimated response time message
  - Link to submit another request

## File Structure
```
tree-support-site/
├── client/                          # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RequestForm/
│   │   │   │   ├── RequestForm.jsx       # Main form component
│   │   │   │   ├── EmergencyTypeSelect.jsx
│   │   │   │   ├── ContactFields.jsx     # Fake contact inputs
│   │   │   │   ├── LocationFields.jsx    # Address/location inputs
│   │   │   │   └── FormValidation.js     # Validation rules
│   │   │   ├── Admin/
│   │   │   │   ├── RequestList.jsx       # Basic list view
│   │   │   │   ├── RequestCard.jsx       # Individual request card
│   │   │   │   └── StatusBadge.jsx       # Status indicator
│   │   │   ├── Confirmation/
│   │   │   │   └── ConfirmationPage.jsx  # Success page
│   │   │   └── UI/
│   │   │       ├── Header.jsx
│   │   │       ├── Button.jsx
│   │   │       └── Input.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Form page
│   │   │   ├── AdminPage.jsx             # Admin list view
│   │   │   └── ConfirmationPage.jsx
│   │   ├── services/
│   │   │   └── api.js                    # API client
│   │   ├── utils/
│   │   │   └── fakeDataGenerator.js      # Generate fake contact info
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                          # Backend Node.js/Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── requests.js              # API routes
│   │   ├── controllers/
│   │   │   └── requestController.js     # Request handlers
│   │   ├── models/
│   │   │   └── Request.js               # Data model
│   │   ├── storage/
│   │   │   └── requestsStorage.js       # JSON file storage
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   └── server.js                    # Express app setup
│   ├── data/
│   │   └── requests.json                # Stored requests
│   └── package.json
│
└── PLAN.md (this file)
```

## API Endpoints

### POST /api/requests
Create new service request
```javascript
// Request body
{
  emergencyType: "Branch Hazard",
  contact: { name, email, phone },
  location: { address, crossStreets, district, coordinates, landmarks },
  description: "..."
}

// Response
{
  success: true,
  requestId: "REQ-2024-001",
  message: "Request submitted successfully"
}
```

### GET /api/requests
Get all requests (for admin view)
```javascript
// Response
{
  success: true,
  requests: [
    { requestId, emergencyType, contact, location, description, submittedAt, status },
    ...
  ],
  total: 42
}
```

### GET /api/requests/:id
Get single request by ID
```javascript
// Response
{
  success: true,
  request: { ... }
}
```

### PATCH /api/requests/:id/status
Update request status (Submitted ↔ Acknowledged)
```javascript
// Request body
{
  status: "Acknowledged"
}

// Response
{
  success: true,
  request: { ... }
}
```

## Implementation Phases

### Phase 1: Backend Setup
1. Initialize Node.js/Express project
2. Set up project structure
3. Create JSON storage system
4. Implement request data model
5. Set up CORS for frontend connection

### Phase 2: API Development
1. Create POST /api/requests endpoint
   - Validate input
   - Generate unique request ID
   - Save to JSON file
   - Return confirmation
2. Create GET /api/requests endpoint
   - Read from JSON file
   - Return all requests
3. Create GET /api/requests/:id endpoint
4. Create PATCH /api/requests/:id/status endpoint
5. Add error handling middleware

### Phase 3: Frontend Setup
1. Initialize React project with Vite
2. Set up routing (React Router)
3. Create basic layout and navigation
4. Configure API client

### Phase 4: Request Form
1. Create form component with React Hook Form
2. Implement emergency type selector
3. Add fake contact info fields
   - Include "Generate Fake Data" button
   - Validate format
4. Add location fields
   - Text inputs for address
   - Optional: mini map for coordinate selection
5. Add description textarea
6. Implement form validation
7. Connect to POST API endpoint

### Phase 5: Admin View
1. Create admin page component
2. Fetch and display all requests
3. Implement table/card layout
4. Add sorting by date
5. Add status toggle functionality
6. Show request count

### Phase 6: Confirmation & Polish
1. Create confirmation page
2. Show request summary and ID
3. Add navigation back to form
4. Implement responsive design
5. Add loading and error states
6. Style with CSS

## Data Validation Rules

### Contact Information
- Name: 2-100 characters, letters and spaces
- Email: Valid email format (even if fake)
- Phone: Korean phone format (010-XXXX-XXXX)

### Location
- Address: Required, min 10 characters
- Cross Streets: Optional, max 200 characters
- District: Required, must be valid Seoul district
- Coordinates: Optional, valid lat/lng range
- Landmarks: Optional, max 500 characters

### Description
- Optional but recommended
- Max 2000 characters

## Emergency Types Detail

### Fallen or Leaning Tree
- Description: Trees that have fallen completely or are dangerously leaning
- Priority: High/Critical
- Typical response: Immediate assessment required

### Branch Hazard
- Description: Broken, hanging, or dead branches that pose danger to people/property
- Priority: Medium/High
- Typical response: Same-day or next-day inspection

### Root Damage
- Description: Tree roots damaging sidewalks, foundations, or underground utilities
- Priority: Low/Medium
- Typical response: Scheduled inspection within 1-2 weeks

## Fake Data Generation
Include helper to generate realistic fake Korean data:
```javascript
// Example fake data generation
const generateFakeContact = () => ({
  name: `${randomFirstName} ${randomLastName} (Demo)`,
  email: `demo.${randomString}@example.com`,
  phone: `010-${randomDigits(4)}-${randomDigits(4)}`
});

// Common Korean names for variety
const firstNames = ["Min-jun", "Seo-yeon", "Do-yoon", "Ji-woo", ...];
const lastNames = ["Kim", "Lee", "Park", "Choi", ...];
```

## UI/UX Considerations
- Clear labeling that this is demo/test data
- Simple, clean form layout
- Mobile-responsive design
- Clear error messages
- Success feedback
- Loading indicators during submission
- Accessibility (ARIA labels, keyboard navigation)

## Performance & Storage
- JSON file storage suitable for demo (hundreds of requests)
- If scaling needed, migrate to SQLite or PostgreSQL
- Implement pagination for admin view if requests exceed 100
- Add search/filter in admin view if needed

## Future Enhancements (Optional)
- Photo upload for tree damage
- Email notifications (mock)
- Request status tracking for users
- Integration with map app (link to tree if exists)
- Advanced admin features (assignment, notes, priority)
- Export requests as CSV
- Analytics dashboard
