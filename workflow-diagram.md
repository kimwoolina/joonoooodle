# Joonoooodle Project Workflow

## Overall System Architecture

```mermaid
graph TB
    subgraph "User Interactions"
        U1[General Users]
        U2[Admin Users]
        U3[Developers/AI Agents]
    end

    subgraph "1. Agent Code Site - AI Code Modification System"
        ACS_UI[Chat Interface<br/>React + Vite]
        ACS_Preview[Live Preview<br/>iframe]
        ACS_Server[Express Server<br/>+ Socket.io]
        ACS_Claude[Claude Service<br/>AI Agent]
        ACS_File[File Service<br/>CRUD Operations]
        ACS_Demo[Demo Site Files<br/>HTML/JS/CSS]

        ACS_UI <-->|WebSocket| ACS_Server
        ACS_Preview -->|HTTP GET| ACS_Server
        ACS_Server --> ACS_Claude
        ACS_Claude --> ACS_File
        ACS_File <--> ACS_Demo
        ACS_Server -.->|file:changed| ACS_Preview
    end

    subgraph "2. Tree Map App - Interactive Seoul Tree Map"
        TM_UI[React Frontend<br/>Leaflet Map]
        TM_Map[Interactive Map<br/>700 Trees]
        TM_Details[Tree Details Panel]
        TM_Search[Address Search<br/>Autocomplete]
        TM_Data[(trees.json<br/>Tree Database)]

        TM_UI --> TM_Map
        TM_UI --> TM_Search
        TM_Map --> TM_Details
        TM_Map --> TM_Data
        TM_Search --> TM_Data
    end

    subgraph "3. Tree Support Site - Customer Support System"
        TS_Home[Home Page<br/>Request Form]
        TS_Admin[Admin Dashboard<br/>Request Management]
        TS_API[Express REST API]
        TS_Controller[Request Controller]
        TS_Storage[(requests.json<br/>Database)]
        TS_Confirm[Confirmation Page]

        TS_Home -->|Submit Request| TS_API
        TS_API --> TS_Controller
        TS_Controller <--> TS_Storage
        TS_Admin -->|Get/Update| TS_API
        TS_API -.->|Request ID| TS_Confirm
    end

    subgraph "4. Main Site - Seoul Tree Support System"
        MS_UI[Main Website<br/>HTML/JS]
        MS_Server[Express Server]
        MS_Map[Tree Map View]
        MS_Git[Git Service<br/>Branch Info]
        MS_Trees[(trees.json<br/>Tree Data)]

        MS_UI --> MS_Server
        MS_Server --> MS_Git
        MS_Server --> MS_Trees
        MS_UI --> MS_Map
    end

    subgraph "External Services"
        Anthropic[Anthropic API<br/>Claude Sonnet 4.5]
        OSM[OpenStreetMap<br/>Map Tiles]
        Unsplash[Unsplash<br/>Tree Photos]
    end

    subgraph "Version Control"
        Git[Git Repository<br/>Branch Management]
        Branches[Feature Branches<br/>claude/*]
    end

    U1 -->|Use Map| TM_UI
    U1 -->|Submit Issue| TS_Home
    U1 -->|View Site| MS_UI
    U2 -->|Manage Requests| TS_Admin
    U3 -->|Chat with AI| ACS_UI

    ACS_Claude <-->|API Calls| Anthropic
    TM_Map -->|Load Tiles| OSM
    TM_Details -->|Load Images| Unsplash

    ACS_File -.->|Commits| Git
    Git --> Branches

    style ACS_Claude fill:#fff4e1
    style Anthropic fill:#ffe1f5
    style TM_Map fill:#e1ffe1
    style TS_Storage fill:#ffe1e1
    style Git fill:#e1f5ff
```

## Detailed Agent Code Site Workflow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI
    participant Socket
    participant Server
    participant Claude
    participant API as Anthropic API
    participant FileService
    participant Git
    participant Preview

    User->>ChatUI: Type message request
    ChatUI->>Socket: message:send
    Socket->>Server: WebSocket event
    Server->>Claude: processMessage()

    Claude->>API: Stream request with tools
    API-->>Claude: content_block_start

    loop Streaming Response
        API-->>Claude: text delta
        Claude->>Socket: message:stream
        Socket->>ChatUI: Display streaming text
    end

    API-->>Claude: tool_use (Read/Write/Edit/Bash)
    Claude->>Claude: executeTool()

    alt Read Tool
        Claude->>FileService: readFile()
        FileService-->>Claude: file contents
    else Write Tool
        Claude->>FileService: writeFile()
        FileService->>Git: Stage changes
        FileService-->>Claude: success
        FileService->>Server: file:changed
    else Edit Tool
        Claude->>FileService: editFile()
        FileService->>Git: Stage changes
        FileService-->>Claude: success
        FileService->>Server: file:changed
    else Bash Tool
        Claude->>FileService: exec command
        FileService-->>Claude: output
    end

    Claude->>Socket: tool:executed
    Socket->>ChatUI: Show notification

    Server->>Socket: file:changed
    Socket->>Preview: Trigger refresh
    Preview->>Server: GET /demo
    Server-->>Preview: Updated files

    Claude->>API: Continue with tool_result
    API-->>Claude: Final response
    Claude->>Socket: message:complete
    Socket->>ChatUI: Display final message
```

## Tree Support Site User Flow

```mermaid
flowchart TD
    Start([User Visits Site]) --> Home[Home Page]
    Home --> Choose{Choose Action}

    Choose -->|Submit Request| Form[Fill Request Form]
    Choose -->|View as Admin| Login[Admin Dashboard]

    Form --> SelectType[Select Emergency Type<br/>Fallen/Leaning/Branch/Root]
    SelectType --> FillContact[Fill Contact Info<br/>Name/Email/Phone]
    FillContact --> FillLocation[Enter Location<br/>District/Address/Details]
    FillLocation --> AddDesc[Optional Description]
    AddDesc --> Validate{Form Valid?}

    Validate -->|No| Error[Show Validation Errors]
    Error --> Form

    Validate -->|Yes| Submit[Submit to API]
    Submit --> SaveDB[(Save to requests.json)]
    SaveDB --> GenID[Generate Request ID]
    GenID --> Confirm[Show Confirmation Page]
    Confirm --> End1([End])

    Login --> ViewRequests[View All Requests<br/>Sorted by Date]
    ViewRequests --> ActionChoice{Admin Action}

    ActionChoice -->|Toggle Status| UpdateStatus[PATCH /api/requests/:id/status]
    UpdateStatus --> UpdateDB[(Update requests.json)]
    UpdateDB --> Refresh[Refresh Request List]
    Refresh --> ViewRequests

    ActionChoice -->|Exit| End2([End])

    style Form fill:#e1f5ff
    style SaveDB fill:#ffe1e1
    style Confirm fill:#e1ffe1
    style UpdateDB fill:#ffe1e1
```

## Tree Map App Data Flow

```mermaid
flowchart LR
    subgraph "Data Source"
        JSON[(trees.json<br/>700 Trees)]
    end

    subgraph "App Initialization"
        Load[Load App] --> Parse[Parse Tree Data]
        Parse --> InitMap[Initialize Leaflet Map]
    end

    subgraph "Map Rendering"
        InitMap --> Cluster[Create Marker Clusters]
        Cluster --> Markers[Render Tree Markers<br/>Color by Health]
        Markers --> Colors{Health Score}

        Colors -->|9-10| Green[Green Marker]
        Colors -->|7-8| Yellow[Yellow Marker]
        Colors -->|5-6| Orange[Orange Marker]
        Colors -->|1-4| Red[Red Marker]
    end

    subgraph "User Interactions"
        Click[User Clicks Marker] --> Popup[Show Popup<br/>Basic Info]
        Popup --> ViewDetails[Click 'View Details']
        ViewDetails --> Panel[Slide-out Detail Panel]

        Panel --> ShowInfo[Display Species Info<br/>Physical Data<br/>Health Metrics]
        Panel --> Gallery[Photo Gallery<br/>from Unsplash]

        Search[Use Search Bar] --> Filter[Filter by Address]
        Filter --> Match[Show Matching Trees]
        Match --> ZoomTo[Zoom to Location]
    end

    JSON --> Parse

    style JSON fill:#ffe1e1
    style Green fill:#90EE90
    style Yellow fill:#FFEB3B
    style Orange fill:#FF9800
    style Red fill:#F44336
    style Panel fill:#e1f5ff
```

## Git Workflow Integration

```mermaid
gitGraph
    commit id: "Initial Setup"
    commit id: "Add Agent Code Site"
    branch claude/feature-branch-1
    checkout claude/feature-branch-1
    commit id: "User Request: Add dark mode"
    commit id: "Claude: Modify styles.css"
    commit id: "Claude: Update index.html"
    checkout main
    merge claude/feature-branch-1 tag: "Admin Approved"

    branch claude/feature-branch-2
    checkout claude/feature-branch-2
    commit id: "User Request: Fix header"
    commit id: "Claude: Edit header styles"
    checkout main
    merge claude/feature-branch-2 tag: "Auto Merge"

    branch claude/final-code-project
    checkout claude/final-code-project
    commit id: "Add Tree Map App"
    commit id: "Add Tree Support Site"
    commit id: "Integrate all systems"
```

## Technology Stack Overview

```mermaid
mindmap
  root((Joonoooodle<br/>Project))
    Frontend
      React 18
        Vite Build Tool
        React Router
      Leaflet Maps
        react-leaflet
        Marker Clustering
      Socket.io Client
        WebSocket
        Real-time Updates
      Styling
        CSS Modules
        Custom CSS
    Backend
      Node.js
        Express Server
        REST API
      Socket.io Server
        WebSocket Events
        File Watching
      Services
        Claude Service
        File Service
        Git Service
        Queue Service
      Storage
        JSON Files
        Chokidar Watcher
    External APIs
      Anthropic API
        Claude Sonnet 4.5
        Tool Use
        Streaming
      OpenStreetMap
        Map Tiles
        Geocoding
      Unsplash
        Tree Photos
        CDN
    Dev Tools
      Git
        Branch Management
        Version Control
      Jest
        Unit Tests
        Integration Tests
      npm
        Package Management
        Scripts
```

## System Data Flow

```mermaid
flowchart TB
    subgraph "Data Sources"
        TreeData[(Tree Data<br/>trees.json)]
        RequestData[(Support Requests<br/>requests.json)]
        QueueData[(Agent Queue<br/>queue.json)]
        DemoFiles[Demo Site Files<br/>index.html, script.js, styles.css]
    end

    subgraph "Agent Code Site Processing"
        UserMsg[User Message] --> ClaudeAPI[Claude API]
        ClaudeAPI --> Tools[Tool Execution<br/>Read/Write/Edit/Bash]
        Tools --> FileOps[File Operations]
        FileOps --> DemoFiles
        DemoFiles --> Preview[Live Preview]
    end

    subgraph "Tree Map Processing"
        TreeData --> MapRender[Map Rendering]
        MapRender --> UserView[User Viewing Trees]
        Search[Address Search] --> FilterLogic[Filter Logic]
        FilterLogic --> TreeData
    end

    subgraph "Support Site Processing"
        FormSubmit[Form Submission] --> Validate[Validation]
        Validate --> APIEndpoint[REST API]
        APIEndpoint --> Controller[Request Controller]
        Controller --> RequestData
        RequestData --> AdminDash[Admin Dashboard]
        AdminDash --> StatusUpdate[Status Updates]
        StatusUpdate --> RequestData
    end

    subgraph "Git Integration"
        FileOps -.-> GitStage[Git Staging]
        GitStage -.-> Branch[Feature Branch]
        Branch -.-> Review[Admin Review]
        Review -.-> Merge[Merge to Main]
    end

    style TreeData fill:#e1ffe1
    style RequestData fill:#ffe1e1
    style QueueData fill:#fff4e1
    style ClaudeAPI fill:#ffe1f5
    style Preview fill:#e1f5ff
```

## Component Communication Matrix

```mermaid
graph LR
    subgraph "Communication Protocols"
        WS[WebSocket<br/>Socket.io<br/>Real-time bidirectional]
        HTTP[HTTP/REST<br/>Request/Response<br/>Stateless]
        FS[File System<br/>Direct I/O<br/>File watching]
        API[External API<br/>Streaming<br/>Tool-based]
    end

    subgraph "Components"
        C1[Agent Chat UI]
        C2[Agent Server]
        C3[Tree Map UI]
        C4[Support Form UI]
        C5[Support Admin UI]
        C6[Support API]
        C7[Main Site UI]
        C8[Main Site Server]
        C9[Claude Service]
        C10[File Service]
    end

    C1 -->|WebSocket| WS
    WS -->|WebSocket| C2
    C2 -->|API Call| API
    API -->|Stream| C9
    C9 -->|Tool Call| C10
    C10 -->|Read/Write| FS

    C3 -->|HTTP GET| HTTP
    C4 -->|HTTP POST| HTTP
    C5 -->|HTTP GET/PATCH| HTTP
    HTTP -->|Response| C6

    C7 -->|HTTP GET| HTTP
    HTTP -->|Response| C8
    C8 -->|Read| FS

    style WS fill:#e1f5ff
    style HTTP fill:#ffe1e1
    style FS fill:#e1ffe1
    style API fill:#ffe1f5
```
