import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ClaudeService } from './services/claudeService.js';
import { FileService } from './services/fileService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Get site paths
const demoSitePath = path.resolve(__dirname, '../../demo-site');
const mainSitePath = path.resolve(__dirname, '../../main-site');

// File service for managing main site files
const fileService = new FileService(mainSitePath);

// API routes (must come before static file serving)
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get file tree
app.get('/api/files', async (req, res) => {
  try {
    const files = await fileService.getFileTree();
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get file content
app.get('/api/files/*', async (req, res) => {
  try {
    const filePath = req.params[0];
    const content = await fileService.readFile(filePath);
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Static file serving (must come after API routes)
// Serve demo site files statically for preview
app.use('/demo', express.static(demoSitePath));

// Serve main site at root path (this should be last)
app.use('/', express.static(mainSitePath));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const claudeService = new ClaudeService(fileService, socket);

  // Handle chat messages
  socket.on('message:send', async (data) => {
    const { message, sessionId } = data;
    console.log('Received message:', message);

    try {
      // Send thinking indicator
      socket.emit('message:thinking', { thinking: true });

      // Process message with Claude and stream response
      await claudeService.processMessage(message, sessionId);

      // Stop thinking indicator
      socket.emit('message:thinking', { thinking: false });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { error: error.message });
      socket.emit('message:thinking', { thinking: false });
    }
  });

  // Handle file watch requests
  socket.on('files:watch', () => {
    fileService.watchFiles((event, filePath) => {
      socket.emit('file:changed', { event, filePath });
    });
  });

  // Handle file unwatch
  socket.on('files:unwatch', () => {
    fileService.stopWatching();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    fileService.stopWatching();
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Demo site path: ${demoSitePath}`);
});
