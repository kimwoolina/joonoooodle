import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GitService } from './services/gitService.js';
import { QueueService } from './services/queueService.js';
import { SessionService } from './services/sessionService.js';
import { FileService } from './services/fileService.js';
import { ClaudeService } from './services/claudeService.v2.js';
import { createUserRouter } from './routes/user.js';
import { createAdminRouter } from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins (for local file:// access)
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Get main site path (renamed from demo-site)
const mainSitePath = path.resolve(__dirname, '../../main-site');

// Initialize services
const gitService = new GitService(mainSitePath);
const queueService = new QueueService();
const sessionService = new SessionService();
const fileService = new FileService(mainSitePath);

// Ensure git repo is initialized
await gitService.initRepo();

// API Routes
const services = { gitService, queueService, sessionService, fileService };
app.use('/api/user', createUserRouter(services));
app.use('/api/admin', createAdminRouter(services));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', sessions: sessionService.getSessionCount() });
});

// Serve main site (from main branch)
app.use('/site', express.static(mainSitePath));

// Serve preview files for a specific branch
app.get('/preview/:branchName*', async (req, res) => {
  try {
    const fullPath = req.params[0]; // Everything after /preview/:branchName
    const pathParts = req.path.split('/').filter(p => p); // ['preview', 'branchName', 'file.html']

    if (pathParts.length < 2) {
      return res.status(400).send('Invalid preview path');
    }

    const branchName = pathParts[1];
    const filePath = pathParts.slice(2).join('/') || 'index.html';

    console.log(`Preview request: branch=${branchName}, file=${filePath}`);

    // Checkout the branch temporarily
    const currentBranch = await gitService.getCurrentBranch();
    await gitService.checkoutBranch(branchName);

    // Serve the requested file from that branch
    const fileFullPath = path.join(mainSitePath, filePath);

    // If serving HTML, inject base tag for proper relative URL resolution
    if (filePath.endsWith('.html')) {
      const fs = require('fs').promises;
      try {
        let html = await fs.readFile(fileFullPath, 'utf8');
        const baseTag = `<base href="/preview/${branchName}/">`;
        html = html.replace('<head>', `<head>\n    ${baseTag}`);
        await gitService.checkoutBranch(currentBranch);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } catch (err) {
        await gitService.checkoutBranch(currentBranch);
        console.error(`Failed to serve ${filePath}:`, err.message);
        res.status(404).send('File not found');
      }
    } else {
      // For non-HTML files, serve directly
      res.sendFile(fileFullPath, (err) => {
        gitService.checkoutBranch(currentBranch);
        if (err && !res.headersSent) {
          console.error(`Failed to serve ${filePath}:`, err.message);
          res.status(404).send('File not found');
        }
      });
    }
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to load preview' });
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const session = sessionService.getOrCreateSession(socket.id);

  // Handle username setup
  socket.on('user:set-name', async (data) => {
    const { username } = data;
    sessionService.setUsername(socket.id, username);
    socket.emit('user:name-set', { username });
  });

  // Handle chat messages
  socket.on('message:send', async (data) => {
    const { message, isNewFeature, featureDescription } = data;
    console.log('Received message:', message);

    try {
      // Check if user has set their name
      const username = sessionService.getUsername(socket.id);
      if (!username) {
        socket.emit('error', { error: 'Please set your name first' });
        return;
      }

      // Send thinking indicator
      socket.emit('message:thinking', { thinking: true });

      // If this is a new feature request, create a branch
      let branchName = sessionService.getActiveBranch(socket.id);

      if (isNewFeature || !branchName) {
        // Create feature slug from description
        const slug = (featureDescription || message)
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .trim()
          .split(/\s+/)
          .slice(0, 3)
          .join('-');

        // Create new branch with session ID for uniqueness
        branchName = await gitService.createFeatureBranch(username, slug, socket.id);
        sessionService.setActiveBranch(socket.id, branchName);

        console.log(`Created feature branch: ${branchName}`);
      } else {
        // Continue on existing branch
        await gitService.checkoutBranch(branchName);
      }

      // Process message with Claude
      const claudeService = new ClaudeService(
        fileService,
        gitService,
        sessionService,
        socket
      );

      await claudeService.processMessage(message, socket.id);

      // When done, notify that preview is ready
      socket.emit('preview:ready', {
        branchName,
        message: 'Your changes are ready for review!',
      });

      socket.emit('message:thinking', { thinking: false });
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { error: error.message });
      socket.emit('message:thinking', { thinking: false });
    }
  });

  // Handle message cancellation
  socket.on('message:cancel', () => {
    const cancelled = sessionService.cancelActiveRequest(socket.id);
    if (cancelled) {
      socket.emit('message:cancelled', { message: 'Request cancelled' });
      socket.emit('message:thinking', { thinking: false });
    }
  });

  // Handle submit for approval
  socket.on('request:submit', async (data) => {
    try {
      const { description } = data;
      const username = sessionService.getUsername(socket.id);
      const branchName = sessionService.getActiveBranch(socket.id);

      if (!username || !branchName) {
        socket.emit('error', { error: 'No active feature to submit' });
        return;
      }

      // Get conversation history
      const conversationHistory = sessionService.getConversationHistory(socket.id);

      // Add to queue
      const request = await queueService.addRequest({
        username,
        branchName,
        description: description || 'Feature request',
        conversationHistory,
      });

      socket.emit('request:submitted', {
        requestId: request.id,
        message: 'Your request has been queued for admin approval!',
      });

      // Clear active branch from session
      sessionService.setActiveBranch(socket.id, null);

      // Checkout main branch
      await gitService.checkoutBranch('main');
    } catch (error) {
      console.error('Error submitting request:', error);
      socket.emit('error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Don't delete session immediately, keep for reconnection
  });
});

// Cleanup tasks
setInterval(() => {
  sessionService.cleanupInactiveSessions();
  queueService.cleanupOldRequests();
}, 3600000); // Every hour

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Main site path: ${mainSitePath}`);
  console.log(`Admin key: ${process.env.ADMIN_KEY || 'admin-secret-key'}`);
});
