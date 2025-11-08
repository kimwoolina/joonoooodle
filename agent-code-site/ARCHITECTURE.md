# Demo Code Agent - Architecture Diagram

## System Overview

The demo code agent is a real-time AI-powered code modification system where Claude can read, write, and execute commands on a live demo website with instant preview feedback.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client (React + Vite)"
        UI[User Interface]
        Chat[Chat Component<br/>Chat.jsx]
        Preview[Preview Component<br/>Preview.jsx]
        Header[Header Component]

        UI --> Header
        UI --> Chat
        UI --> Preview
    end

    subgraph "WebSocket Layer"
        WS[Socket.io<br/>Bidirectional Communication]
    end

    subgraph "Server (Node.js + Express)"
        Server[Express Server<br/>server.js]
        SocketHandler[Socket.io Handler<br/>Event Routing]

        subgraph "Services"
            ClaudeService[Claude Service<br/>claudeService.js]
            FileService[File Service<br/>fileService.js]
        end

        Server --> SocketHandler
        SocketHandler --> ClaudeService
        ClaudeService --> FileService
    end

    subgraph "External Services"
        AnthropicAPI[Anthropic API<br/>Claude Sonnet 4.5]
    end

    subgraph "File System"
        DemoSite[Demo Site Files<br/>index.html, script.js, styles.css]
        Watcher[Chokidar<br/>File Watcher]

        FileService --> DemoSite
        FileService --> Watcher
        Watcher -.-> DemoSite
    end

    subgraph "Tools Engine"
        ReadTool[Read Tool]
        WriteTool[Write Tool]
        EditTool[Edit Tool]
        BashTool[Bash Tool]
        GlobTool[Glob Tool]
        GrepTool[Grep Tool]

        ClaudeService --> ReadTool
        ClaudeService --> WriteTool
        ClaudeService --> EditTool
        ClaudeService --> BashTool
        ClaudeService --> GlobTool
        ClaudeService --> GrepTool

        ReadTool --> FileService
        WriteTool --> FileService
        EditTool --> FileService
        BashTool --> FileService
        GlobTool --> FileService
        GrepTool --> FileService
    end

    Chat <-->|Socket.io Events| WS
    WS <--> SocketHandler

    ClaudeService <-->|Streaming API| AnthropicAPI

    Preview -->|HTTP GET| Server
    Server -->|Serve Static| DemoSite

    Watcher -.->|file:changed| SocketHandler
    SocketHandler -.->|file:changed| WS
    WS -.->|Refresh| Preview

    style Chat fill:#e1f5ff
    style Preview fill:#e1f5ff
    style ClaudeService fill:#fff4e1
    style FileService fill:#fff4e1
    style AnthropicAPI fill:#ffe1f5
    style DemoSite fill:#e1ffe1
```

## Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant Chat
    participant Socket
    participant Server
    participant Claude as Claude Service
    participant API as Anthropic API
    participant Files as File Service
    participant Demo as Demo Site
    participant Preview

    User->>Chat: Type message
    Chat->>Socket: message:send
    Socket->>Server: WebSocket event
    Server->>Claude: processMessage()

    Claude->>API: Stream request
    API-->>Claude: content_block_start
    API-->>Claude: content_block_delta (text)
    Claude->>Socket: message:stream
    Socket->>Chat: Display streaming text

    API-->>Claude: tool_use detected
    Claude->>Claude: executeTool()

    alt Read Tool
        Claude->>Files: readFile()
        Files-->>Claude: file contents
    else Write Tool
        Claude->>Files: writeFile()
        Files->>Demo: Create/update file
        Files-->>Claude: success
        Files->>Server: file:changed event
    else Edit Tool
        Claude->>Files: editFile()
        Files->>Demo: Modify file
        Files-->>Claude: success
        Files->>Server: file:changed event
    else Bash Tool
        Claude->>Files: Execute command
        Files-->>Claude: command output
    end

    Claude->>Socket: tool:executed
    Socket->>Chat: Show tool notification

    Server->>Socket: file:changed
    Socket->>Preview: Trigger refresh
    Preview->>Server: GET /demo
    Server->>Demo: Serve updated files
    Demo-->>Preview: Render updated site

    Claude->>API: Continue with tool result
    API-->>Claude: Final response
    Claude->>Socket: message:stream (complete)
    Socket->>Chat: Display final message
```

## Data Flow

```mermaid
flowchart LR
    subgraph Input
        A[User Message]
    end

    subgraph "Conversation History"
        B[Previous Messages]
        C[Tool Uses]
        D[Tool Results]
    end

    subgraph "Claude API"
        E[Streaming Response]
        F[Text Deltas]
        G[Tool Calls]
    end

    subgraph "Tool Execution"
        H[Parse Tool Input]
        I[Execute via FileService]
        J[Generate Tool Result]
    end

    subgraph Output
        K[Streamed Text to Client]
        L[File Modifications]
        M[Preview Refresh]
    end

    A --> B
    B --> E
    C --> E
    D --> E

    E --> F
    E --> G

    F --> K

    G --> H
    H --> I
    I --> J
    J --> D
    I --> L
    L --> M

    D --> E
```

## Component Responsibilities

### Client Layer

| Component | File | Responsibilities |
|-----------|------|-----------------|
| **App** | `client/src/App.jsx` | Main layout, header + chat + preview panels |
| **Chat** | `client/src/components/Chat/Chat.jsx` | Socket.io connection, message display, streaming |
| **Preview** | `client/src/components/Preview/Preview.jsx` | Iframe displaying demo site, auto-refresh |
| **MessageList** | `client/src/components/Chat/MessageList.jsx` | Render chat messages with markdown |
| **MessageInput** | `client/src/components/Chat/MessageInput.jsx` | User input form |

### Server Layer

| Component | File | Responsibilities |
|-----------|------|-----------------|
| **Express Server** | `server/src/server.js` | HTTP server, static file serving, Socket.io setup |
| **Socket Handler** | `server/src/server.js` | WebSocket event routing, file watching |
| **Claude Service** | `server/src/services/claudeService.js` | Claude API integration, tool execution, streaming |
| **File Service** | `server/src/services/fileService.js` | File operations, change watching, glob/grep |

### Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| **Read** | Read file contents | `file_path` | File content string |
| **Write** | Create/overwrite file | `file_path`, `content` | Success message |
| **Edit** | Replace string in file | `file_path`, `old_string`, `new_string` | Success message |
| **Bash** | Execute shell command | `command` | Command output |
| **Glob** | Find files by pattern | `pattern` | Array of file paths |
| **Grep** | Search text in files | `pattern`, `search_path` | Matching lines |

## Socket.io Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `message:send` | `{message, sessionId}` | User sends chat message |
| `files:watch` | - | Start watching demo site files |
| `files:unwatch` | - | Stop watching files |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:thinking` | `{isThinking}` | AI thinking indicator |
| `message:stream` | `{text, isComplete}` | Streaming text from Claude |
| `tool:executed` | `{tool, success}` | Tool execution notification |
| `file:changed` | `{path}` | File changed (triggers refresh) |
| `error` | `{message}` | Error occurred |

## Conversation History Structure

The Claude service maintains multi-turn conversation history:

```javascript
conversationHistory = [
  {
    role: 'user',
    content: 'Change the background color to blue'
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_abc123',
        name: 'Read',
        input: { file_path: 'styles.css' }
      }
    ]
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_abc123',
        content: 'body { background: red; }'
      }
    ]
  },
  {
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_def456',
        name: 'Edit',
        input: {
          file_path: 'styles.css',
          old_string: 'background: red',
          new_string: 'background: blue'
        }
      }
    ]
  },
  {
    role: 'user',
    content: [
      {
        type: 'tool_result',
        tool_use_id: 'tool_def456',
        content: '{"success": true}'
      }
    ]
  },
  {
    role: 'assistant',
    content: 'I\'ve changed the background color to blue!'
  }
]
```

## Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **Vite 5.0.8** - Build tool and dev server
- **Socket.io Client 4.7.2** - WebSocket client
- **React Markdown 9.0.1** - Markdown rendering
- **React Syntax Highlighter 15.5.0** - Code highlighting

### Backend
- **Node.js** - Runtime
- **Express 4.18.2** - HTTP server
- **Socket.io 4.7.2** - WebSocket server
- **@anthropic-ai/sdk 0.30.1** - Claude API client
- **Chokidar 3.5.3** - File watching
- **Glob 10.3.10** - Pattern matching
- **CORS 2.8.5** - Cross-origin support

### External APIs
- **Anthropic API** - Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

## File Structure

```
agent-code-site/
├── client/                    # React frontend
│   ├── src/
│   │   ├── main.jsx          # Entry point
│   │   ├── App.jsx           # Main layout
│   │   └── components/
│   │       ├── Chat/         # Chat UI
│   │       ├── Preview/      # Preview iframe
│   │       └── UI/           # Shared UI components
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── server.js         # Express + Socket.io
│   │   └── services/
│   │       ├── claudeService.js  # Claude integration
│   │       └── fileService.js    # File operations
│   └── package.json
│
└── demo-site/                 # Files modified by Claude
    ├── index.html
    ├── script.js
    ├── styles.css
    └── package.json
```

## Security Considerations

1. **File System Isolation**: All file operations are restricted to the `demo-site/` directory
2. **Bash Command Safety**: Commands execute in `demo-site/` directory only, 30s timeout
3. **CORS Configuration**: Limited to specified CLIENT_URL
4. **Environment Variables**: API keys stored in `.env` files (not committed)
5. **Input Validation**: File paths validated, directory creation controlled

## Future Improvements (from REBUILD_PLAN.md)

1. **Git Branch Support** - Create unique branches per user request
2. **Approval Queue** - Admin dashboard to review/approve changes
3. **Interruptible Chat** - Allow users to stop ongoing operations
4. **User Identification** - Session management and user tracking
5. **Embedded Chat Widget** - Move from split-view to overlay
6. **Staging/Preview** - Test changes before applying
7. **Enhanced Security** - More granular permissions and sandboxing
