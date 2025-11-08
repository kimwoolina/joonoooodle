/**
 * Request validation middleware
 */

export const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  next();
};

export const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    if (!req.is('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
};
