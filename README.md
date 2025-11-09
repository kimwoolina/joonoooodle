# PaGenie 🌳🤖

> **AI-Powered Website Management Agent for Non-Technical Users**<br>
> **비개발자도 자연어로 웹사이트를 수정·관리할 수 있는 AI 에이전트**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Overview

PaGenie is an AI-powered website management system that enables non-technical users to modify and manage websites using natural language commands. Built with Claude AI, it transforms the way people interact with web content—no coding required.

### The Problem We're Solving

> **"Change the banner text to '2025 New Policy Guide'"**

This simple request typically requires:
- Finding a developer or outsourcing company
- Waiting days or weeks for implementation
- Paying hundreds to thousands of dollars
- Dealing with communication overhead

With PaGenie, the same change happens **instantly** through natural language.

---

## 🚀 Key Features

### 1. **Natural Language Website Editing**
- Type commands like "Change the header color to blue"
- AI analyzes code structure, generates changes, and applies them
- Real-time preview before deployment

### 2. **Integrated Tree Management System**
- **Interactive Map View**: Displays 700+ trees across Seoul with health status
- **Support Request System**: Submit and track tree maintenance requests
- **Unified Interface**: Previously separate systems now work together seamlessly
- **Location Integration**: Support requests show tree locations on the map

### 3. **Admin Dashboard**
- Review all AI-generated change requests
- Approve or reject modifications
- Track change history
- User-friendly interface for administrators

### 4. **Real-Time Collaboration**
- Live preview of changes before deployment
- WebSocket-based instant updates
- Multi-user support with session management

---

## 🏗️ Architecture

### System Components

```
pagenie/
├── agent-code-site/          # AI Agent & Integrated Main Site
│   ├── client/               # React UI for AI chat interface
│   ├── server/               # Node.js backend with Claude AI integration
│   └── main-site/            # Integrated Seoul Tree Support System
│
├── tree-map-app/             # Interactive Tree Map (React + Leaflet)
│   └── 700+ trees with health metrics, photos, and details
│
└── tree-support-site/        # Tree Support Request System
    ├── client/               # React frontend for support tickets
    └── server/               # Node.js API for request management
```

### Technology Stack

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **React Hook Form** - Form management

#### Backend
- **Node.js** - Runtime environment
- **Express** - HTTP server
- **Socket.io** - WebSocket server
- **Anthropic Claude AI SDK** - AI agent integration
- **Chokidar** - File system watching

#### AI & Tools
- **Claude Sonnet 4.5** - Natural language understanding and code generation
- **Custom Tool System** - Read, Write, Edit, Bash, Glob, Grep tools
- **Real-time Streaming** - Instant AI response delivery

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for Claude AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kimwoolina/joonoooodle.git
   cd joonoooodle
   ```

2. **Setup Agent Code Site (Main Application)**
   ```bash
   cd agent-code-site/server
   npm install

   # Create .env file with your Anthropic API key
   echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
   echo "CLIENT_URL=http://localhost:5173" >> .env

   # Start server
   npm run dev
   ```

3. **Start AI Agent Client**
   ```bash
   cd agent-code-site/client
   npm install
   npm run dev
   ```

4. **Optional: Run Standalone Apps**

   **Tree Map App:**
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

### Usage

1. **Open the application**: Navigate to `http://localhost:3000`
2. **View the integrated map**: See trees and support requests together
3. **Open AI Agent Chat**: Click the chat icon to interact with the AI
4. **Make changes**: Type natural language commands like:
   - "Change the header text to 'Seoul Urban Forest Management'"
   - "Add a button to export requests as CSV"
   - "Change the map marker color for high-priority requests to red"
5. **Review preview**: See changes in real-time
6. **Deploy**: Approve changes through admin dashboard

---

## 🎓 Use Cases

### Government & Municipalities
- **Parks & Recreation**: Manage facilities, equipment, and maintenance
- **Public Works**: Track infrastructure issues and repairs
- **Citizen Services**: Update service hours, policies, and announcements

### Small-to-Medium Businesses
- **Retail**: Update product descriptions, pricing, promotions
- **Restaurants**: Modify menus, hours, special events
- **Services**: Change service offerings, staff information

### Non-Profits
- **Event Management**: Update event calendars and registration
- **Donation Drives**: Modify campaign messaging and progress
- **Volunteer Coordination**: Update schedules and opportunities

---

## 🔒 Security Considerations

- **File System Isolation**: AI operations restricted to designated directories
- **Command Sandboxing**: Bash commands execute with timeout and path restrictions
- **Admin Approval Flow**: All changes require admin review before deployment
- **Session Management**: User identification and activity tracking
- **API Key Protection**: Environment variables, never committed to repository
- **CORS Configuration**: Restricted to specified client URLs

---

**Built with Claude AI 🤖 | Made for Everyone 🌍**
