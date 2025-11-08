import express from 'express';
import { requestController } from '../controllers/requestController.js';

const router = express.Router();

/**
 * Routes for service request operations
 */

// POST /api/requests - Create new service request
router.post('/', requestController.createRequest);

// GET /api/requests - Get all requests
router.get('/', requestController.getAllRequests);

// GET /api/requests/:id - Get single request by ID
router.get('/:id', requestController.getRequestById);

// PATCH /api/requests/:id/status - Update request status
router.patch('/:id/status', requestController.updateRequestStatus);

export default router;
