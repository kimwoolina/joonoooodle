import { Request } from '../models/Request.js';
import { storage } from '../storage/requestsStorage.js';

/**
 * Controller for handling service request operations
 */
export const requestController = {
  /**
   * Create a new service request
   */
  async createRequest(req, res, next) {
    try {
      // Validate request data
      const validation = Request.validate(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      // Create request instance
      const request = new Request(req.body);

      // Save to storage
      const savedRequest = await storage.save(request.toJSON());

      res.status(201).json({
        success: true,
        requestId: savedRequest.requestId,
        message: 'Request submitted successfully',
        request: savedRequest
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all service requests
   */
  async getAllRequests(req, res, next) {
    try {
      const requests = await storage.getAll();
      const total = await storage.count();

      // Sort by submission date (newest first)
      requests.sort((a, b) =>
        new Date(b.submittedAt) - new Date(a.submittedAt)
      );

      res.json({
        success: true,
        requests,
        total
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single request by ID
   */
  async getRequestById(req, res, next) {
    try {
      const { id } = req.params;
      const request = await storage.getById(id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      res.json({
        success: true,
        request
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update request status
   */
  async updateRequestStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['Submitted', 'Acknowledged'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be "Submitted" or "Acknowledged"'
        });
      }

      // Update request
      const updatedRequest = await storage.update(id, { status });

      res.json({
        success: true,
        message: 'Status updated successfully',
        request: updatedRequest
      });
    } catch (error) {
      if (error.message === 'Request not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
};
