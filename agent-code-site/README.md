# Agent Code Site

Seoul Tree Support System - A web application for managing tree support requests in Seoul.

## Features

- 🌳 Interactive map showing tree locations
- 📝 Submit and view support requests
- 🗺️ Real-time location tracking with Leaflet maps
- 📊 Request management system
- 🌿 Git branch indicator in header

## Project Structure

```
agent-code-site/
├── server/          # Node.js backend (Express)
└── main-site/       # Seoul Tree Support System website
```

## Setup

### Prerequisites

- Node.js 18+

### Installation

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

### Running the Application

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`

## Usage

Once the application is running at http://localhost:3000:

1. View the interactive map showing tree locations across Seoul
2. Click "View Requests" to see all support requests
3. Click "Submit Request" to create a new tree support request
4. The git branch indicator appears in the header (top right) showing which branch you're on

## Tech Stack

- Node.js
- Express
- Leaflet (maps)
- Vanilla JavaScript

## Development

- **Application**: `http://localhost:3000` - Seoul Tree Support System
- **API endpoint for branch**: `http://localhost:3000/api/git/branch`
- **API endpoint for trees**: `http://localhost:3000/api/trees`
