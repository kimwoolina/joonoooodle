/**
 * API client for tree support service requests
 */

const API_BASE_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors || []
    );
  }

  return data;
}

export const api = {
  /**
   * Create a new service request
   */
  async createRequest(requestData) {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    return handleResponse(response);
  },

  /**
   * Get all service requests
   */
  async getAllRequests() {
    const response = await fetch(`${API_BASE_URL}/requests`);
    return handleResponse(response);
  },

  /**
   * Get a single request by ID
   */
  async getRequestById(requestId) {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`);
    return handleResponse(response);
  },

  /**
   * Update request status
   */
  async updateRequestStatus(requestId, status) {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    return handleResponse(response);
  },
};

export { ApiError };
