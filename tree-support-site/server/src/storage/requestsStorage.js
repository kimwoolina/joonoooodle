import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data/requests.json');

/**
 * JSON file-based storage for service requests
 */
class RequestsStorage {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await fs.access(DATA_FILE);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    this.initialized = true;
  }

  async getAll() {
    await this.initialize();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async getById(requestId) {
    const requests = await this.getAll();
    return requests.find(req => req.requestId === requestId);
  }

  async save(request) {
    await this.initialize();
    const requests = await this.getAll();

    // Check for duplicate request ID
    const exists = requests.some(req => req.requestId === request.requestId);
    if (exists) {
      throw new Error('Request with this ID already exists');
    }

    requests.push(request);
    await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2), 'utf-8');
    return request;
  }

  async update(requestId, updates) {
    await this.initialize();
    const requests = await this.getAll();
    const index = requests.findIndex(req => req.requestId === requestId);

    if (index === -1) {
      throw new Error('Request not found');
    }

    requests[index] = { ...requests[index], ...updates };
    await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2), 'utf-8');
    return requests[index];
  }

  async delete(requestId) {
    await this.initialize();
    const requests = await this.getAll();
    const filtered = requests.filter(req => req.requestId !== requestId);

    if (filtered.length === requests.length) {
      throw new Error('Request not found');
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }

  async count() {
    const requests = await this.getAll();
    return requests.length;
  }
}

export const storage = new RequestsStorage();
