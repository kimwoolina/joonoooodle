import express from 'express';

const router = express.Router();

// Simple admin authentication middleware
// TODO: Replace with real auth in production
function adminAuth(req, res, next) {
  const { adminKey } = req.headers;

  // For now, use environment variable or simple key
  const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-secret-key';

  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

export function createAdminRouter(services) {
  const { queueService, gitService } = services;

  // Apply auth to all admin routes
  router.use(adminAuth);

  /**
   * Get all pending requests
   */
  router.get('/queue', async (req, res) => {
    try {
      const { status } = req.query;

      let requests;
      if (status) {
        requests = await queueService.getAllRequests(status);
      } else {
        requests = await queueService.getPendingRequests();
      }

      res.json({ requests });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get queue statistics
   */
  router.get('/queue/stats', async (req, res) => {
    try {
      const stats = await queueService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get specific request details
   */
  router.get('/queue/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      const request = await queueService.getRequestById(requestId);

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Get diff for the branch
      const diff = await gitService.getDiff(request.branchName);
      const changedFiles = await gitService.getChangedFiles(request.branchName);

      res.json({
        ...request,
        diff,
        changedFiles,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Approve a request (merge to main)
   */
  router.post('/approve/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      const { adminName, note } = req.body;

      const request = await queueService.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({ error: 'Request already reviewed' });
      }

      // Merge branch to main
      await gitService.mergeBranch(request.branchName, adminName || 'Admin');

      // Update queue status
      await queueService.approveRequest(requestId, adminName || 'Admin', note);

      // Delete feature branch
      await gitService.deleteBranch(request.branchName);

      res.json({
        success: true,
        message: 'Request approved and merged to main',
        requestId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Reject a request (delete branch)
   */
  router.post('/reject/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      const { adminName, note } = req.body;

      const request = await queueService.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({ error: 'Request already reviewed' });
      }

      // Update queue status
      await queueService.rejectRequest(requestId, adminName || 'Admin', note);

      // Delete feature branch
      await gitService.deleteBranch(request.branchName);

      res.json({
        success: true,
        message: 'Request rejected and branch deleted',
        requestId,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get preview for any branch (admin can preview any user's changes)
   */
  router.get('/preview/:branchName', async (req, res) => {
    try {
      const { branchName } = req.params;

      const branches = await gitService.getFeatureBranches();
      if (!branches.includes(branchName)) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const diff = await gitService.getDiff(branchName);
      const changedFiles = await gitService.getChangedFiles(branchName);

      res.json({
        branchName,
        diff,
        changedFiles,
        previewUrl: `/preview/${branchName}`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
