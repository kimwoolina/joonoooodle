import express from 'express';
import cors from 'cors';
import requestRoutes from './routes/requests.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateContentType } from './middleware/validation.js';

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Middleware
 */
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies
app.use(validateContentType); // Validate content type

/**
 * Routes
 */
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Tree Support Service API',
    version: '1.0.0',
    endpoints: {
      'POST /api/requests': 'Create new service request',
      'GET /api/requests': 'Get all requests',
      'GET /api/requests/:id': 'Get request by ID',
      'PATCH /api/requests/:id/status': 'Update request status'
    }
  });
});

app.use('/api/requests', requestRoutes);

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🌳 Tree Support Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;
