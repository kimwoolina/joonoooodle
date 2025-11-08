import express from 'express';

const router = express.Router();

export function createUserRouter(services) {
  const { sessionService, queueService, gitService } = services;

  /**
   * Set username for session
   */
  router.post('/name', async (req, res) => {
    try {
      const { username, sessionId } = req.body;

      if (!username || !sessionId) {
        return res.status(400).json({ error: 'Username and sessionId required' });
      }

      sessionService.setUsername(sessionId, username);

      res.json({
        success: true,
        username,
        sessionId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get username for session
   */
  router.get('/name/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const username = sessionService.getUsername(sessionId);

      res.json({ username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get user's request status
   */
  router.get('/status/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const username = sessionService.getUsername(sessionId);

      if (!username) {
        return res.json({ requests: [] });
      }

      const requests = await queueService.getRequestsByUser(username);

      res.json({
        username,
        requests: requests.map(r => ({
          id: r.id,
          description: r.description,
          branchName: r.branchName,
          status: r.status,
          timestamp: r.timestamp,
          reviewedBy: r.reviewedBy,
          reviewedAt: r.reviewedAt,
          reviewNote: r.reviewNote,
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Cancel a pending request
   */
  router.post('/cancel/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      const { sessionId } = req.body;

      const username = sessionService.getUsername(sessionId);
      if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const success = await queueService.cancelRequest(requestId, username);

      if (!success) {
        return res.status(404).json({ error: 'Request not found or cannot be cancelled' });
      }

      // Delete the branch
      const request = await queueService.getRequestById(requestId);
      if (request) {
        await gitService.deleteBranch(request.branchName);
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get preview URL for a branch
   */
  router.get('/preview/:branchName', async (req, res) => {
    try {
      const { branchName } = req.params;

      // Check if branch exists
      const branches = await gitService.getFeatureBranches();
      if (!branches.includes(branchName)) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      // Return preview info
      res.json({
        branchName,
        previewUrl: `/preview/${branchName}`,
        files: await gitService.getChangedFiles(branchName),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Check if branch is behind main
   */
  router.get('/branch-status', async (req, res) => {
    try {
      const { branch } = req.query;

      if (!branch) {
        return res.status(400).json({ error: 'Branch name required' });
      }

      const behindMain = await gitService.isBranchBehindMain(branch);

      res.json({ behindMain });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Sync branch with main
   */
  router.post('/sync-with-main', async (req, res) => {
    try {
      const { branchName, force, checkOnly } = req.body;

      if (!branchName) {
        return res.status(400).json({ error: 'Branch name required' });
      }

      const result = await gitService.syncBranchWithMain(branchName, force, checkOnly);

      if (result.conflicts && !force) {
        return res.json({
          conflicts: true,
          conflictsSummary: result.conflictsSummary,
          message: 'Conflicts detected. Use force to override.'
        });
      }

      res.json({
        success: true,
        message: checkOnly ? 'No conflicts detected' : 'Branch synced successfully',
        conflicts: false
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
