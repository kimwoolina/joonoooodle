# Agent Code Site - Detailed Plan

## Overview
An agent-embedded website where users can chat with an AI agent powered by Claude Code. The agent can modify a demo website by editing files, creating new files, installing packages, and showing live previews. The agent runs in a Podman container in "yolo mode" (unrestricted access) for maximum flexibility.

## Technology Stack
- **Frontend**: React (with Vite)
- **Backend**: Node.js + Express
- **Chat UI**: Custom React chat components or react-chat-ui
- **AI**: Claude API (Anthropic)
- **Containerization**: Podman
- **Code Execution**: Claude Code CLI in container
- **Real-time Communication**: WebSocket (Socket.io)
- **Code Editor**: Monaco Editor (VS Code editor) for preview
- **File System**: Virtual in-memory fs or container volume

## Architecture

### High-Level Flow
```
User (Browser)
    ↓ WebSocket
Backend (Node.js/Express)
    ↓ API Calls
Claude API
    ↓ Tool Calls
Claude Code in Podman Container
    ↓ Executes
Demo Website Files (in container)
    ↓ Serves
Live Preview (iframe in frontend)
```

### Components
1. **Frontend Chat Interface**: User sends messages, views agent responses and code changes
2. **Backend API Server**: Handles chat, manages Claude API, orchestrates container
3. **Podman Container**: Isolated environment running Claude Code CLI
4. **Demo Website**: Simple website that agent can modify
5. **Live Preview**: Real-time view of demo website changes

## Core Features

### 1. Chat Interface
- **Messages Display**
  - User messages (right-aligned)
  - Agent responses (left-aligned)
  - Code blocks with syntax highlighting
  - File change indicators
  - Loading states ("Agent is thinking...")

- **Input Area**
  - Text input for user messages
  - Send button
  - Auto-resize textarea
  - Character count (optional)

- **Chat History**
  - Persistent session storage
  - Scroll to latest message
  - Clear chat button

### 2. Agent Capabilities

#### Edit Existing Files
- Agent can read and modify files in demo website
- Shows diffs of changes
- Updates reflected in live preview

#### Create New Files
- Agent can create new components, pages, styles
- Validates file paths
- Updates file tree view

#### Install Packages
- Agent can run `npm install <package>`
- Shows installation progress
- Updates package.json

#### Preview Changes
- Live preview in iframe or new tab
- Auto-refresh on file changes
- Show build errors if any

### 3. Demo Website (Included)
A simple but functional website that agent can modify:

**Initial Demo Website Structure**
```
demo-site/
├── index.html
├── styles.css
├── script.js
├── package.json
├── components/
│   ├── Header.js
│   └── Footer.js
└── README.md
```

**Demo Website Features**
- Simple landing page with header, content, footer
- A few interactive elements (button, counter, etc.)
- Basic styling
- Vanilla JavaScript (or simple React app)

Users can ask the agent to:
- Change colors/styling
- Add new sections
- Create new components
- Add functionality (forms, animations, etc.)
- Install libraries (like lodash, moment, etc.)

### 4. Claude Code in Podman Container

#### Container Setup
- **Base Image**: Node.js + Claude Code CLI
- **Mode**: "Yolo mode" (no restrictions)
- **Volumes**:
  - Demo website files mounted
  - Node modules (for npm operations)
- **Network**: Allow outbound for npm installs
- **Permissions**: Full read/write access to demo site

#### Container Lifecycle
- Container starts when user first loads page
- Persists during session
- Destroyed on session end or timeout
- Can be reset by user

### 5. File Browser & Editor
- **File Tree View**
  - Show demo website structure
  - Clickable to view file contents
  - Indicate modified files

- **Code Editor** (Monaco Editor)
  - Syntax highlighting
  - Read-only or editable
  - Inline with chat or separate panel

### 6. Live Preview
- **Preview Panel**
  - Iframe showing demo website
  - Refresh button
  - Open in new tab button
  - Responsive preview toggle (mobile/tablet/desktop)

- **Auto-Update**
  - Watches for file changes
  - Auto-refreshes preview
  - Shows build/error status

## File Structure
```
agent-code-site/
├── client/                              # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatContainer.jsx         # Main chat wrapper
│   │   │   │   ├── MessageList.jsx           # Message display
│   │   │   │   ├── MessageInput.jsx          # User input
│   │   │   │   ├── Message.jsx               # Individual message
│   │   │   │   ├── CodeBlock.jsx             # Code display with syntax highlighting
│   │   │   │   └── TypingIndicator.jsx       # "Agent is typing..."
│   │   │   ├── FileExplorer/
│   │   │   │   ├── FileTree.jsx              # File browser
│   │   │   │   ├── FileNode.jsx              # Individual file/folder
│   │   │   │   └── FileViewer.jsx            # View file contents
│   │   │   ├── CodeEditor/
│   │   │   │   └── MonacoEditor.jsx          # Monaco code editor
│   │   │   ├── Preview/
│   │   │   │   ├── PreviewPanel.jsx          # Live preview iframe
│   │   │   │   └── PreviewControls.jsx       # Refresh, resize, etc.
│   │   │   └── UI/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Layout.jsx
│   │   ├── services/
│   │   │   ├── websocket.js                  # Socket.io client
│   │   │   └── api.js                        # HTTP API client
│   │   ├── hooks/
│   │   │   ├── useChat.js                    # Chat state management
│   │   │   └── useWebSocket.js               # WebSocket hook
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                              # Backend Node.js/Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.js                       # Chat endpoints
│   │   │   └── container.js                  # Container management
│   │   ├── controllers/
│   │   │   ├── chatController.js             # Handle chat messages
│   │   │   └── containerController.js        # Podman operations
│   │   ├── services/
│   │   │   ├── claudeService.js              # Claude API integration
│   │   │   ├── containerService.js           # Podman container management
│   │   │   ├── claudeCodeService.js          # Execute Claude Code in container
│   │   │   └── fileWatcher.js                # Watch demo site for changes
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── websocket.js                  # Socket.io middleware
│   │   ├── utils/
│   │   │   ├── codeParser.js                 # Parse code from agent responses
│   │   │   └── diffGenerator.js              # Generate file diffs
│   │   └── server.js                         # Express + Socket.io setup
│   └── package.json
│
├── container/                           # Podman container setup
│   ├── Dockerfile                            # Container image definition
│   ├── claude-code-setup.sh                  # Install Claude Code CLI
│   └── entrypoint.sh                         # Container startup script
│
├── demo-site/                           # Demo website that agent modifies
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── package.json
│   └── README.md
│
└── PLAN.md (this file)
```

## API & WebSocket Events

### HTTP Endpoints

#### POST /api/chat/session
Create new chat session (initializes container)
```javascript
// Response
{
  sessionId: "session-abc123",
  containerId: "podman-container-xyz",
  status: "ready"
}
```

#### DELETE /api/chat/session/:sessionId
End session and destroy container

#### GET /api/files
Get demo website file tree

#### GET /api/files/:path
Get specific file contents

### WebSocket Events

#### Client → Server

**`message:send`**
User sends message to agent
```javascript
{
  sessionId: "session-abc123",
  message: "Add a dark mode toggle button"
}
```

**`container:reset`**
Request container reset to initial state

#### Server → Client

**`message:response`**
Agent response
```javascript
{
  message: "I'll add a dark mode toggle button for you...",
  codeChanges: [
    {
      file: "script.js",
      action: "modified",
      diff: "..."
    }
  ]
}
```

**`message:thinking`**
Agent is processing (show typing indicator)

**`file:changed`**
File was modified
```javascript
{
  file: "styles.css",
  content: "...",
  action: "modified"
}
```

**`preview:refresh`**
Trigger preview refresh

**`error`**
Error occurred
```javascript
{
  error: "Container execution failed",
  details: "..."
}
```

## Implementation Phases

### Phase 1: Backend Foundation
1. Initialize Node.js/Express project
2. Set up WebSocket with Socket.io
3. Integrate Claude API
4. Create session management
5. Implement basic chat endpoint

### Phase 2: Podman Container Setup
1. Create Dockerfile with Node.js
2. Install Claude Code CLI in container
3. Set up demo website files
4. Configure container volumes
5. Implement container lifecycle management:
   - Start container on session create
   - Stop container on session end
   - Health checks

### Phase 3: Claude Code Integration
1. Set up Claude Code CLI in container
2. Create service to execute Claude Code commands
3. Implement file operations:
   - Read files
   - Write files
   - Create files
4. Implement package installation
5. Capture and stream output back to client

### Phase 4: Frontend Chat Interface
1. Initialize React project
2. Create chat UI components
3. Implement WebSocket client
4. Display messages and code blocks
5. Add syntax highlighting
6. Handle loading states

### Phase 5: File Explorer & Editor
1. Create file tree component
2. Fetch and display demo site structure
3. Integrate Monaco Editor
4. Allow file viewing
5. Show file changes/diffs

### Phase 6: Live Preview
1. Create preview panel with iframe
2. Serve demo website from container
3. Implement auto-refresh on changes
4. Add preview controls (refresh, resize)
5. Handle build errors

### Phase 7: Agent Intelligence & Tools
1. Configure Claude Code with full capabilities
2. Implement tool calling:
   - Edit file
   - Create file
   - Install package
   - Run commands
3. Parse agent responses for code changes
4. Stream real-time updates to client

### Phase 8: Polish & UX
1. Improve chat UX (smooth scrolling, etc.)
2. Add error handling and recovery
3. Implement container reset functionality
4. Add example prompts/suggestions
5. Style and responsive design
6. Add documentation/help

## Claude Code Configuration

### System Prompt for Agent
```
You are an AI assistant embedded in a web application. You can modify
a demo website by editing files, creating new files, and installing packages.

Current project: A simple demo website with HTML, CSS, and JavaScript.

You have access to:
- File system (read/write)
- npm package manager
- Build tools

When making changes:
1. Explain what you're doing
2. Show code changes clearly
3. Test changes before confirming
4. Handle errors gracefully

Be helpful, clear, and educational in your responses.
```

### Available Tools in Claude Code
- `Read`: Read file contents
- `Write`: Create or overwrite files
- `Edit`: Modify existing files
- `Bash`: Run shell commands (npm install, etc.)
- `Grep`: Search code
- `Glob`: Find files

### Example Agent Interactions

**User**: "Add a dark mode toggle"

**Agent**: "I'll add a dark mode toggle button to your website. Let me:
1. Add a toggle button to the HTML
2. Create CSS for dark mode styles
3. Add JavaScript to handle the toggle

Let me start by editing index.html..."

[Agent uses Write tool to modify files, shows diffs, updates preview]

## Security Considerations (Yolo Mode)

Since this is "yolo mode" (unrestricted), be aware:
- ⚠️ Container has full file system access (within container)
- ⚠️ Can install any npm package
- ⚠️ Can run arbitrary commands
- ⚠️ No sandboxing restrictions

**Mitigations**:
- Container is isolated from host
- Session-based (destroyed after use)
- No persistent data outside session
- Rate limiting on API calls
- Timeout limits on commands

**NOT SUITABLE FOR PRODUCTION** - This is a demo/development setup

## Demo Website Ideas

### Initial Demo Site
A simple personal portfolio/landing page with:
- Header with navigation
- Hero section
- About section
- Projects section (cards)
- Contact form
- Footer

Users can ask agent to:
- "Change the color scheme to blue"
- "Add a projects section with cards"
- "Make the header sticky on scroll"
- "Add smooth scrolling animations"
- "Install and use lodash for data formatting"
- "Create a new contact form component"
- "Add a dark mode toggle"
- "Make it responsive for mobile"

## Performance Considerations
- Container startup time (5-10 seconds)
- WebSocket latency for real-time updates
- Claude API response time (2-10 seconds)
- File watching overhead
- Preview refresh performance

**Optimizations**:
- Keep container warm during session
- Debounce file watch events
- Stream responses for better UX
- Cache file tree
- Lazy load Monaco Editor

## Error Handling

### Container Errors
- Container fails to start → Show error, retry option
- Container crashes → Auto-restart, notify user
- Container timeout → Kill and restart

### Claude API Errors
- Rate limit → Show message, queue request
- API error → Show friendly error, allow retry
- Invalid response → Parse gracefully, ask for clarification

### Code Execution Errors
- Syntax errors → Show in preview panel
- Build failures → Display error log
- npm install failures → Show package error, suggest alternatives

## Future Enhancements (Optional)
- Multiple demo site templates to choose from
- Save and share modified websites
- Export website as zip file
- Collaborate with others (multi-user sessions)
- Version control (git) integration
- Undo/redo functionality
- Advanced Claude Code features (debugging, testing)
- Deploy modified site to hosting platform
- AI code review and suggestions
- Tutorial mode with guided examples

## Development Notes

### Local Development Setup
1. Install Podman: `brew install podman`
2. Initialize Podman: `podman machine init && podman machine start`
3. Build container: `podman build -t claude-code-agent ./container`
4. Set up environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `PODMAN_PATH`: Path to podman binary
5. Install dependencies: `npm install` (in both client and server)
6. Run backend: `cd server && npm run dev`
7. Run frontend: `cd client && npm run dev`

### Environment Variables
```
# Server .env
ANTHROPIC_API_KEY=sk-ant-xxx
PORT=3000
PODMAN_PATH=/usr/local/bin/podman
CONTAINER_IMAGE=claude-code-agent
SESSION_TIMEOUT=3600000

# Client .env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Testing Strategy
- Unit tests for services (Claude API, container management)
- Integration tests for WebSocket communication
- E2E tests for chat flow
- Manual testing of agent capabilities
- Container isolation testing

## Documentation to Include
1. **User Guide**: How to use the chat interface
2. **Example Prompts**: Common requests users can try
3. **Architecture Diagram**: Visual flow of system
4. **API Reference**: All endpoints and events
5. **Troubleshooting**: Common issues and solutions
