<div align="center">

# 🌳 PaGenie 🤖

### AI-Powered Website Management Agent for Non-Technical Users
### 비개발자도 자연어로 웹사이트를 수정·관리할 수 있는 AI 에이전트

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4.5-191919)](https://www.anthropic.com/)

</div>

<br/>

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#️-architecture)
- [Getting Started](#️-getting-started)
- [Use Cases](#-use-cases)
- [Security](#-security)

<br/>

## 🎯 Overview

**PaGenie** is an AI-powered website management system that revolutionizes how non-technical users interact with web content. By leveraging Claude AI's natural language understanding, PaGenie enables anyone to modify and manage websites through simple conversational commands—**no coding required**.

<br/>

### 💡 The Problem We're Solving

Traditional website modifications create significant barriers:

| **Traditional Approach** | **With PaGenie** |
|---|---|
| 🕐 Days to weeks of waiting | ⚡ Instant changes |
| 💰 $100-$500 per modification | 💵 Minimal cost |
| 👨‍💻 Developer dependency | 🗣️ Natural language commands |
| 📧 Communication overhead | 🤖 Direct AI interaction |

<br/>

**Example:**
> _"Change the banner text to '2025 New Policy Guide'"_

Instead of hiring a developer, waiting days, and paying hundreds of dollars—PaGenie executes this change **instantly** through natural language.

<br/>
<br/>

## 🚀 Key Features

### 🎨 **Natural Language Website Editing**

Transform your website with simple commands:
- Type instructions like _"Change the header color to blue"_
- AI analyzes code structure and generates precise modifications
- Real-time preview before deployment
- Instant rollback capability

<br/>

### 🗺️ **Integrated Tree Management System**

A comprehensive solution for urban forestry management:
- **Interactive Map View** - Visualize 700+ trees across Seoul with health status indicators
- **Support Request System** - Submit and track tree maintenance requests seamlessly
- **Unified Interface** - Previously disconnected systems now work together
- **Location Integration** - Automatic display of tree locations on support tickets

<br/>

### 📊 **Admin Dashboard**

Complete oversight and control:
- Review all AI-generated change requests
- Approve or reject modifications with one click
- Track comprehensive change history
- User-friendly interface for non-technical administrators

<br/>

### ⚡ **Real-Time Collaboration**

Built for modern workflows:
- Live preview of changes before deployment
- WebSocket-based instant updates
- Multi-user support with intelligent session management
- Conflict resolution and version control

<br/>
<br/>

## 💻 Technology Stack

### Frontend Technologies

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io_Client-4.7-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)

[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Markdown](https://img.shields.io/badge/React_Markdown-9.0-000000?logo=markdown&logoColor=white)](https://github.com/remarkjs/react-markdown)

<br/>

### Backend Technologies

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io_Server-4.7-010101?logo=socket.io&logoColor=white)](https://socket.io/)

[![Chokidar](https://img.shields.io/badge/Chokidar-3.5-orange)](https://github.com/paulmillr/chokidar)
[![CORS](https://img.shields.io/badge/CORS-2.8-blue)](https://github.com/expressjs/cors)
[![dotenv](https://img.shields.io/badge/dotenv-16.3-ECD53F)](https://github.com/motdotla/dotenv)

<br/>

### AI & Developer Tools

[![Anthropic Claude](https://img.shields.io/badge/Anthropic-Claude_Sonnet_4.5-191919?logo=anthropic)](https://www.anthropic.com/)
[![AI SDK](https://img.shields.io/badge/Anthropic_SDK-0.30-191919)](https://www.npmjs.com/package/@anthropic-ai/sdk)

**Custom Tool System**: Read, Write, Edit, Bash, Glob, Grep tools with real-time streaming capabilities

<br/>
<br/>

## 🏗️ Architecture

### System Overview

```
pagenie/
│
├── agent-code-site/              # AI Agent & Integrated Main Site
│   ├── client/                   # React UI for AI chat interface
│   │   ├── src/
│   │   │   ├── components/      # Chat, Preview, UI components
│   │   │   └── services/        # Socket.io client services
│   │   └── package.json
│   │
│   ├── server/                   # Node.js backend with Claude AI
│   │   ├── src/
│   │   │   ├── services/        # Claude AI, File operations
│   │   │   └── server.js        # Express + Socket.io setup
│   │   └── package.json
│   │
│   └── main-site/                # Integrated Seoul Tree Support System
│       ├── index.html
│       ├── script.js
│       └── styles.css
│
├── tree-map-app/                 # Interactive Tree Map (React + Leaflet)
│   ├── src/
│   │   ├── components/          # Map, TreeMarker, DetailPanel
│   │   ├── data/                # Tree data (700+ entries)
│   │   └── utils/               # Map utilities, search functions
│   └── package.json
│
└── tree-support-site/            # Tree Support Request System
    ├── client/                   # React frontend for support tickets
    │   ├── src/
    │   │   ├── pages/           # RequestForm, Admin, Confirmation
    │   │   └── services/        # API client
    │   └── package.json
    │
    └── server/                   # Node.js API for request management
        ├── src/
        │   ├── routes/          # API endpoints
        │   └── controllers/     # Request handlers
        └── package.json
```

<br/>

### Key Components

| Component | Description | Technology |
|-----------|-------------|------------|
| **AI Agent Client** | Chat interface for natural language commands | React, Socket.io, Markdown |
| **AI Agent Server** | Claude AI integration and tool execution | Node.js, Express, Anthropic SDK |
| **Main Site** | Integrated tree management interface | HTML, CSS, JavaScript, Leaflet |
| **Tree Map App** | Interactive map with 700+ trees | React, Leaflet, React-Leaflet |
| **Support System** | Request submission and admin management | React, Node.js, React Hook Form |

<br/>
<br/>

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Anthropic API Key** for Claude AI ([Get API Key](https://console.anthropic.com/))

<br/>

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kimwoolina/joonoooodle.git
cd joonoooodle
```

<br/>

#### 2️⃣ Setup Agent Code Site (Main Application)

```bash
cd agent-code-site/server
npm install

# Create .env file with your Anthropic API key
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
echo "CLIENT_URL=http://localhost:5173" >> .env

# Start the server
npm run dev
```

<br/>

#### 3️⃣ Start AI Agent Client

```bash
cd agent-code-site/client
npm install
npm run dev
```

<br/>

#### 4️⃣ Optional: Run Standalone Apps

**Tree Map Application:**
```bash
cd tree-map-app
npm install
npm run dev
```

**Tree Support Site:**
```bash
# Server
cd tree-support-site/server
npm install
npm start

# Client (new terminal)
cd tree-support-site/client
npm install
npm run dev
```

<br/>

### 🎮 Usage Guide

1. **Open the Application**
   - Navigate to `http://localhost:3000` in your browser

2. **Explore the Integrated Map**
   - View 700+ trees across Seoul with health status indicators
   - Click trees to see detailed information

3. **Interact with AI Agent**
   - Click the chat icon to open the AI interface
   - Type natural language commands to modify the website

4. **Example Commands**
   - _"Change the header text to 'Seoul Urban Forest Management'"_
   - _"Add a button to export requests as CSV"_
   - _"Change the map marker color for high-priority requests to red"_

5. **Review & Deploy**
   - See real-time preview of changes
   - Approve changes through the admin dashboard

<br/>
<br/>

## 🎓 Use Cases

### 🏛️ Government & Municipalities

**Parks & Recreation Departments**
- Update facility hours and closures
- Manage equipment inventory and status
- Post maintenance schedules and alerts

**Public Works**
- Track infrastructure issues in real-time
- Update repair schedules and closures
- Manage citizen complaint workflows

**Citizen Services**
- Update service hours and holiday schedules
- Post policy changes and announcements
- Manage public information portals

<br/>

### 🏢 Small-to-Medium Businesses

**Retail Operations**
- Update product descriptions and pricing
- Modify promotional banners and campaigns
- Manage inventory availability displays

**Restaurant & Hospitality**
- Change menu items and pricing
- Update hours of operation
- Announce special events and promotions

**Professional Services**
- Update service offerings and packages
- Modify staff bios and contact information
- Change appointment availability

<br/>

### 🌱 Non-Profit Organizations

**Event Management**
- Update event calendars and registration links
- Modify event details and locations
- Post last-minute changes and updates

**Fundraising Campaigns**
- Update campaign messaging and goals
- Track and display donation progress
- Modify donor recognition displays

**Volunteer Coordination**
- Update volunteer schedules and opportunities
- Modify shift requirements and locations
- Post urgent volunteer needs

<br/>
<br/>

## 🔒 Security

PaGenie implements comprehensive security measures to ensure safe operation:

### 🛡️ Core Security Features

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **File System Isolation** | AI operations restricted to designated directories | Prevents unauthorized file access |
| **Command Sandboxing** | Bash commands execute with timeout and path restrictions | Limits potential damage from malicious commands |
| **Admin Approval Flow** | All changes require admin review before deployment | Human oversight of AI-generated modifications |
| **Session Management** | User identification and activity tracking | Audit trail and accountability |
| **API Key Protection** | Environment variables, never committed to repository | Prevents credential exposure |
| **CORS Configuration** | Restricted to specified client URLs | Prevents unauthorized cross-origin requests |

<br/>

### 🔐 Best Practices

- Regularly rotate API keys
- Review admin approval queue daily
- Monitor system logs for unusual activity
- Keep dependencies updated
- Use HTTPS in production environments
- Implement rate limiting for API endpoints

<br/>
<br/>

---

<div align="center">

### 🤖 Built with Claude AI | 🌍 Made for Everyone

**[Report Issues](https://github.com/kimwoolina/joonoooodle/issues)** • **[Request Features](https://github.com/kimwoolina/joonoooodle/issues/new)**

</div>
