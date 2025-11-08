import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { GitService } from './services/gitService.js';
import { QueueService } from './services/queueService.js';
import { SessionService } from './services/sessionService.js';
import { FileService } from './services/fileService.js';
import { ClaudeService } from './services/claudeService.js';
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
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

// Get paths
const mainSitePath = path.resolve(__dirname, '../../main-site');
const worktreesBasePath = path.resolve(__dirname, '../../worktrees');

// Initialize services with worktree support
const gitService = new GitService(mainSitePath, worktreesBasePath);
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

// User login endpoint
app.post('/api/user/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Create user worktree if it doesn't exist
    const { branchName, worktreePath } = await gitService.createUserWorktree(username);

    // Set cookie with unique name
    res.cookie('agent_code_username', username, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: false, // Must be false so JavaScript can read it
      sameSite: 'lax',
      path: '/'
    });

    res.json({
      success: true,
      username,
      branchName,
      redirectUrl: `/w/${branchName}/`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user info
app.get('/api/user/me', (req, res) => {
  console.log('Checking user session, cookies:', req.cookies);
  const username = req.cookies.agent_code_username;

  if (!username) {
    console.log('No agent_code_username cookie found');
    return res.json({ loggedIn: false });
  }

  const branchName = `user-${username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  console.log('User logged in:', username, 'branch:', branchName);
  res.json({
    loggedIn: true,
    username,
    branchName,
    worktreeUrl: `/w/${branchName}/`
  });
});

// Logout endpoint
app.post('/api/user/logout', (req, res) => {
  res.clearCookie('agent_code_username');
  res.json({ success: true });
});

// Get current git branch
app.get('/api/git/branch', async (req, res) => {
  try {
    const username = req.cookies.agent_code_username;

    if (!username) {
      const branch = await gitService.getCurrentBranch(mainSitePath);
      return res.json({ branch });
    }

    const branchName = `user-${username.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const worktreePath = await gitService.getWorktreePath(branchName);

    if (worktreePath) {
      const branch = await gitService.getCurrentBranch(worktreePath);
      res.json({ branch });
    } else {
      res.json({ branch: 'main' });
    }
  } catch (error) {
    console.error('Error getting git branch:', error);
    res.json({ branch: null });
  }
});

// List all worktrees
app.get('/api/worktrees', async (req, res) => {
  try {
    const worktrees = await gitService.listWorktrees();
    res.json({ worktrees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve worktrees dynamically at /w/:branch/*
app.use('/w/:branch', async (req, res, next) => {
  try {
    const { branch } = req.params;
    const worktreePath = await gitService.getWorktreePath(branch);

    if (!worktreePath) {
      return res.status(404).send('Worktree not found');
    }

    // Serve static files from worktree
    express.static(worktreePath)(req, res, next);
  } catch (error) {
    console.error('Error serving worktree:', error);
    res.status(500).send('Error loading worktree');
  }
});

// Serve main site (from main branch)
app.use('/site', express.static(mainSitePath));

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

      // If this is a new feature request, create a worktree
      let branchName = sessionService.getActiveBranch(socket.id);
      let worktreePath;

      if (isNewFeature || !branchName) {
        // Create feature slug from description
        const slug = (featureDescription || message)
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .trim()
          .split(/\s+/)
          .slice(0, 3)
          .join('-');

        // Create new worktree with session ID for uniqueness
        const result = await gitService.createFeatureWorktree(username, slug, socket.id);
        branchName = result.branchName;
        worktreePath = result.worktreePath;
        sessionService.setActiveBranch(socket.id, branchName);

        console.log(`Created feature worktree: ${branchName} at ${worktreePath}`);
      } else {
        // Get existing worktree path
        worktreePath = await gitService.getWorktreePath(branchName);
        if (!worktreePath) {
          socket.emit('error', { error: 'Worktree not found' });
          socket.emit('message:thinking', { thinking: false });
          return;
        }
      }

      // Create a FileService instance for this specific worktree
      const worktreeFileService = new FileService(worktreePath);

      // Process message with Claude
      const claudeService = new ClaudeService(
        worktreeFileService,
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
