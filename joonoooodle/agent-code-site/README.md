# Agent Code Site

An interactive web application where users can chat with an AI agent powered by Claude that can modify a live demo website in real-time.

## Features

- 💬 Real-time chat interface with Claude AI
- 🎨 Live preview of demo website modifications
- 🔧 Agent can edit files, create new files, and run commands
- ⚡ Streaming responses for immediate feedback
- 🔄 File watching with auto-refresh

## Project Structure

```
agent-code-site/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express + Socket.io)
└── demo-site/       # Demo website that agent modifies
```

## Setup

### Prerequisites

- Node.js 18+
- Anthropic API key

### Installation

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Configure environment variables:**

   Edit `server/.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3000
   CLIENT_URL=http://localhost:5173
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   cd client
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Usage

Once the application is running:

1. The chat interface will be on the left side
2. The live preview of the demo website will be on the right
3. Try these example prompts:
   - "Add a dark mode toggle"
   - "Change the color scheme to ocean blue"
   - "Add a new section with an image gallery"
   - "Make the header sticky on scroll"

The AI agent will modify the demo website files in real-time, and you'll see the changes immediately in the preview panel!

## How It Works

1. User sends a message through the chat interface
2. Message is sent via WebSocket to the backend server
3. Backend sends the message to Claude API with available tools
4. Claude processes the request and decides which tools to use
5. Tools execute (Read, Write, Edit, Bash, etc.) to modify demo site files
6. Changes are streamed back to the frontend in real-time
7. Preview automatically refreshes to show the updated website

## Available Tools for the Agent

- **Read**: Read file contents
- **Write**: Create or overwrite files
- **Edit**: Modify existing files
- **Bash**: Run shell commands (npm install, etc.)
- **Glob**: Find files by pattern
- **Grep**: Search for text in files

## Tech Stack

### Frontend
- React 18
- Vite
- Socket.io Client
- React Markdown
- React Syntax Highlighter

### Backend
- Node.js
- Express
- Socket.io
- Anthropic SDK
- Chokidar (file watching)

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3000`
- Demo site is served at `http://localhost:3000/demo`

## Notes

- This is a development/demo setup, not production-ready
- The AI agent has full access to modify files in the demo-site directory
- File changes are watched and trigger automatic preview refreshes
- Each client connection gets its own Claude conversation context
