import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class QueueService {
  constructor(queueFilePath) {
    this.queueFilePath = queueFilePath || path.join(__dirname, '../../data/queue.json');
    this.queue = [];
    this.init();
  }

  /**
   * Initialize queue (load from file)
   */
  async init() {
    try {
      // Ensure data directory exists
      const dir = path.dirname(this.queueFilePath);
      await fs.mkdir(dir, { recursive: true });

      // Load existing queue or create new
      try {
        const data = await fs.readFile(this.queueFilePath, 'utf-8');
        this.queue = JSON.parse(data);
      } catch {
        // File doesn't exist, start with empty queue
        this.queue = [];
        await this.save();
      }

      console.log(`Queue initialized with ${this.queue.length} items`);
    } catch (error) {
      console.error('Failed to initialize queue:', error);
      this.queue = [];
    }
  }

  /**
   * Add a new request to the queue
   * @param {Object} request - Request details
   * @returns {Promise<Object>} - Created request with ID
   */
  async addRequest({
    username,
    branchName,
    description,
    conversationHistory,
  }) {
    const request = {
      id: this.generateId(),
      username,
      branchName,
      description,
      conversationHistory: conversationHistory || [],
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
    };

    this.queue.push(request);
    await this.save();

    console.log(`Added request to queue: ${request.id} (${username}: ${description})`);
    return request;
  }

  /**
   * Get all pending requests
   * @returns {Promise<Object[]>}
   */
  async getPendingRequests() {
    return this.queue.filter(r => r.status === 'pending');
  }

  /**
   * Get all requests (with optional status filter)
   * @param {string} status - Optional status filter
   * @returns {Promise<Object[]>}
   */
  async getAllRequests(status = null) {
    if (status) {
      return this.queue.filter(r => r.status === status);
    }
    return this.queue;
  }

  /**
   * Get a specific request by ID
   * @param {string} id - Request ID
   * @returns {Promise<Object|null>}
   */
  async getRequestById(id) {
    return this.queue.find(r => r.id === id) || null;
  }

  /**
   * Get requests by username
   * @param {string} username - Username
   * @returns {Promise<Object[]>}
   */
  async getRequestsByUser(username) {
    return this.queue.filter(r => r.username === username);
  }

  /**
   * Approve a request
   * @param {string} id - Request ID
   * @param {string} reviewedBy - Admin who approved
   * @param {string} note - Optional approval note
   * @returns {Promise<Object|null>}
   */
  async approveRequest(id, reviewedBy, note = null) {
    const request = this.queue.find(r => r.id === id);
    if (!request) {
      return null;
    }

    request.status = 'approved';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date().toISOString();
    request.reviewNote = note;

    await this.save();

    console.log(`Approved request: ${id} by ${reviewedBy}`);
    return request;
  }

  /**
   * Reject a request
   * @param {string} id - Request ID
   * @param {string} reviewedBy - Admin who rejected
   * @param {string} note - Rejection reason
   * @returns {Promise<Object|null>}
   */
  async rejectRequest(id, reviewedBy, note = null) {
    const request = this.queue.find(r => r.id === id);
    if (!request) {
      return null;
    }

    request.status = 'rejected';
    request.reviewedBy = reviewedBy;
    request.reviewedAt = new Date().toISOString();
    request.reviewNote = note;

    await this.save();

    console.log(`Rejected request: ${id} by ${reviewedBy}`);
    return request;
  }

  /**
   * Cancel a request (by user)
   * @param {string} id - Request ID
   * @param {string} username - Username (must match)
   * @returns {Promise<boolean>}
   */
  async cancelRequest(id, username) {
    const request = this.queue.find(r => r.id === id);
    if (!request || request.username !== username) {
      return false;
    }

    if (request.status !== 'pending') {
      return false; // Can't cancel already reviewed requests
    }

    request.status = 'cancelled';
    request.reviewedAt = new Date().toISOString();

    await this.save();

    console.log(`Cancelled request: ${id} by ${username}`);
    return true;
  }

  /**
   * Delete a request from queue
   * @param {string} id - Request ID
   * @returns {Promise<boolean>}
   */
  async deleteRequest(id) {
    const index = this.queue.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }

    this.queue.splice(index, 1);
    await this.save();

    console.log(`Deleted request: ${id}`);
    return true;
  }

  /**
   * Clean up old requests (older than 30 days)
   * @returns {Promise<number>} - Number of deleted requests
   */
  async cleanupOldRequests() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const before = this.queue.length;
    this.queue = this.queue.filter(r => {
      const timestamp = new Date(r.timestamp);
      return timestamp > thirtyDaysAgo;
    });

    const deleted = before - this.queue.length;

    if (deleted > 0) {
      await this.save();
      console.log(`Cleaned up ${deleted} old requests`);
    }

    return deleted;
  }

  /**
   * Save queue to file
   * @private
   */
  async save() {
    try {
      await fs.writeFile(
        this.queueFilePath,
        JSON.stringify(this.queue, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to save queue:', error);
    }
  }

  /**
   * Generate unique ID
   * @private
   */
  generateId() {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    return {
      total: this.queue.length,
      pending: this.queue.filter(r => r.status === 'pending').length,
      approved: this.queue.filter(r => r.status === 'approved').length,
      rejected: this.queue.filter(r => r.status === 'rejected').length,
      cancelled: this.queue.filter(r => r.status === 'cancelled').length,
    };
  }
}
