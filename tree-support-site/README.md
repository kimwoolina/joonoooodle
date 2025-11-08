# Tree Support Site

A customer support website where users can submit service requests about tree emergencies. The site handles reports of fallen/leaning trees, branch hazards, and root damage.

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: Node.js + Express
- **Database**: JSON file storage
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Styling**: Custom CSS

## Features

### 1. Service Request Submission
- Emergency type selection (Fallen/Leaning Tree, Branch Hazard, Root Damage)
- Demo contact information with auto-generation
- Location details with Seoul district selector
- Form validation
- Request confirmation

### 2. Admin View
- View all submitted requests
- Sort by submission date
- Toggle request status (Submitted ↔ Acknowledged)
- Request count display

### 3. Confirmation Page
- Request summary with unique ID
- What's next information
- Quick navigation to submit another request

## Project Structure

```
tree-support-site/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── utils/         # Utilities (fake data generator)
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Data models
│   │   ├── storage/      # JSON file storage
│   │   └── middleware/   # Express middleware
│   ├── data/             # JSON data storage
│   └── package.json
│
└── PLAN.md               # Detailed planning document
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Running

1. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm start
   ```
   Server will run on http://localhost:3001

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Open your browser**
   Navigate to http://localhost:5173

## API Endpoints

- `POST /api/requests` - Create new service request
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `PATCH /api/requests/:id/status` - Update request status

## Usage

### Submitting a Request

1. Go to the home page
2. Select an emergency type
3. Fill in contact information (or use "Generate Demo Data")
4. Enter location details
5. Add optional description
6. Submit the form
7. View confirmation with request ID

### Admin View

1. Navigate to "Admin View" in the header
2. View all submitted requests
3. Click status button to toggle between "Submitted" and "Acknowledged"
4. Requests are sorted by submission date (newest first)

## Demo Data

This application uses fake/demo data for testing purposes:
- Auto-generated Korean names
- Demo email addresses (@example.com)
- Korean phone number format (010-XXXX-XXXX)
- Seoul districts for location

## Development

### Backend Development
```bash
cd server
npm run dev  # Runs with --watch flag for auto-reload
```

### Frontend Development
```bash
cd client
npm run dev  # Vite dev server with HMR
```

## Future Enhancements

- Photo upload for tree damage
- Email notifications
- Request status tracking for users
- Integration with tree map app
- Advanced admin features (assignment, notes, priority)
- Analytics dashboard
- Export requests as CSV

## License

MIT
