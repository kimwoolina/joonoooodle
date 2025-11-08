export class SessionService {
  constructor() {
    // Store active sessions in memory
    // Key: sessionId, Value: session data
    this.sessions = new Map();

    // Store active AI requests (for interruption)
    // Key: sessionId, Value: AbortController
    this.activeRequests = new Map();
  }

  /**
   * Create or get a session
   * @param {string} sessionId - Socket/session ID
   * @returns {Object} - Session data
   */
  getOrCreateSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        username: null,
        activeBranch: null,
        conversationHistory: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    }

    const session = this.sessions.get(sessionId);
    session.lastActivity = new Date().toISOString();

    return session;
  }

  /**
   * Get session by ID
   * @param {string} sessionId
   * @returns {Object|null}
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Set username for a session
   * @param {string} sessionId
   * @param {string} username
   */
  setUsername(sessionId, username) {
    const session = this.getOrCreateSession(sessionId);
    session.username = username;
    return session;
  }

  /**
   * Get username for a session
   * @param {string} sessionId
   * @returns {string|null}
   */
  getUsername(sessionId) {
    const session = this.getSession(sessionId);
    return session?.username || null;
  }

  /**
   * Set active branch for a session
   * @param {string} sessionId
   * @param {string} branchName
   */
  setActiveBranch(sessionId, branchName) {
    const session = this.getOrCreateSession(sessionId);
    session.activeBranch = branchName;
    return session;
  }

  /**
   * Get active branch for a session
   * @param {string} sessionId
   * @returns {string|null}
   */
  getActiveBranch(sessionId) {
    const session = this.getSession(sessionId);
    return session?.activeBranch || null;
  }

  /**
   * Add message to conversation history
   * @param {string} sessionId
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   */
  addMessage(sessionId, role, content) {
    const session = this.getOrCreateSession(sessionId);
    session.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });
    return session;
  }

  /**
   * Get conversation history
   * @param {string} sessionId
   * @returns {Array}
   */
  getConversationHistory(sessionId) {
    const session = this.getSession(sessionId);
    return session?.conversationHistory || [];
  }

  /**
   * Clear conversation history
   * @param {string} sessionId
   */
  clearConversationHistory(sessionId) {
    const session = this.getSession(sessionId);
    if (session) {
      session.conversationHistory = [];
    }
  }

  /**
   * Register an active AI request (for interruption)
   * @param {string} sessionId
   * @param {AbortController} abortController
   */
  registerActiveRequest(sessionId, abortController) {
    // Cancel any existing request for this session
    this.cancelActiveRequest(sessionId);

    this.activeRequests.set(sessionId, abortController);
  }

  /**
   * Cancel active AI request for a session
   * @param {string} sessionId
   * @returns {boolean} - True if cancelled, false if no active request
   */
  cancelActiveRequest(sessionId) {
    const abortController = this.activeRequests.get(sessionId);
    if (abortController) {
      abortController.abort();
      this.activeRequests.delete(sessionId);
      console.log(`Cancelled active request for session: ${sessionId}`);
      return true;
    }
    return false;
  }

  /**
   * Check if session has an active AI request
   * @param {string} sessionId
   * @returns {boolean}
   */
  hasActiveRequest(sessionId) {
    return this.activeRequests.has(sessionId);
  }

  /**
   * Clear active request (after completion)
   * @param {string} sessionId
   */
  clearActiveRequest(sessionId) {
    this.activeRequests.delete(sessionId);
  }

  /**
   * Delete a session
   * @param {string} sessionId
   */
  deleteSession(sessionId) {
    this.cancelActiveRequest(sessionId);
    this.sessions.delete(sessionId);
    console.log(`Deleted session: ${sessionId}`);
  }

  /**
   * Cleanup inactive sessions (older than 24 hours)
   */
  cleanupInactiveSessions() {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    let cleanedUp = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastActivity = new Date(session.lastActivity);
      if (lastActivity < twentyFourHoursAgo) {
        this.deleteSession(sessionId);
        cleanedUp++;
      }
    }

    if (cleanedUp > 0) {
      console.log(`Cleaned up ${cleanedUp} inactive sessions`);
    }

    return cleanedUp;
  }

  /**
   * Get all active sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Get session count
   */
  getSessionCount() {
    return this.sessions.size;
  }
}
