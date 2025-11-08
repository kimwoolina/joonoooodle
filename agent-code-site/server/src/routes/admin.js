import express from 'express';

const router = express.Router();

export function createAdminRouter(services) {
  const { queueService, gitService } = services;

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

      // Merge user branch to main
      await gitService.mergeToMain(request.branchName, adminName || 'Admin');

      // Update queue status
      await queueService.approveRequest(requestId, adminName || 'Admin', note);

      // Cleanup feature branch if it exists
      if (request.featureBranch) {
        try {
          await gitService.removeWorktree(request.featureBranch);
        } catch (err) {
          console.log(`Feature branch ${request.featureBranch} already cleaned up`);
        }
      }

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
