import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ClaudeService } from '../src/services/claudeService.js';
import { FileService } from '../src/services/fileService.js';
import { SessionService } from '../src/services/sessionService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk');

describe('ClaudeService', () => {
  let claudeService;
  let fileService;
  let sessionService;
  let mockGitService;
  let mockSocket;
  let testDir;
  let testSessionId;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(__dirname, 'temp-claude-test');
    await fs.mkdir(testDir, { recursive: true });

    // Create FileService with test directory
    fileService = new FileService(testDir);

    // Create SessionService
    sessionService = new SessionService();
    testSessionId = 'test-session-123';

    // Mock GitService
    mockGitService = {
      commitChanges: jest.fn().mockResolvedValue(undefined),
    };

    // Mock Socket.io socket
    mockSocket = {
      emit: jest.fn(),
    };

    // Create ClaudeService
    claudeService = new ClaudeService(fileService, mockGitService, sessionService, mockSocket);

    // Mock API key
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with correct properties', () => {
      expect(claudeService.fileService).toBe(fileService);
      expect(claudeService.gitService).toBe(mockGitService);
      expect(claudeService.sessionService).toBe(sessionService);
      expect(claudeService.socket).toBe(mockSocket);
    });

    it('should have Anthropic client', () => {
      expect(claudeService.client).toBeDefined();
    });
  });

  describe('getSystemPrompt', () => {
    it('should return a string', () => {
      const prompt = claudeService.getSystemPrompt();

      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should mention helpful assistant', () => {
      const prompt = claudeService.getSystemPrompt();

      expect(prompt.toLowerCase()).toContain('helpful');
    });
  });

  describe('getTools', () => {
    it('should return array of tools', () => {
      const tools = claudeService.getTools();

      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });

    it('should include Read tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Read')).toBe(true);
    });

    it('should include Write tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Write')).toBe(true);
    });

    it('should include Edit tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Edit')).toBe(true);
    });

    it('should include Bash tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Bash')).toBe(true);
    });

    it('should include Glob tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Glob')).toBe(true);
    });

    it('should include Grep tool', () => {
      const tools = claudeService.getTools();

      expect(tools.some(tool => tool.name === 'Grep')).toBe(true);
    });

    it('should have proper tool schema', () => {
      const tools = claudeService.getTools();

      tools.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('input_schema');
      });
    });
  });

  describe('executeTool - Read', () => {
    it('should execute Read tool successfully', async () => {
      const filePath = 'test.txt';
      const content = 'Hello, world!';
      await fs.writeFile(path.join(testDir, filePath), content);

      const toolUse = {
        name: 'Read',
        input: { file_path: filePath }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result).toBe(content);
    });

    it('should throw error for non-existent file', async () => {
      const toolUse = {
        name: 'Read',
        input: { file_path: 'nonexistent.txt' }
      };

      await expect(claudeService.executeTool(toolUse)).rejects.toThrow();
    });
  });

  describe('executeTool - Write', () => {
    it('should execute Write tool successfully', async () => {
      const toolUse = {
        name: 'Write',
        input: {
          file_path: 'new.txt',
          content: 'New content'
        }
      };

      // Set username for session (required for git commits)
      sessionService.setUsername(testSessionId, 'testuser');

      const result = await claudeService.executeTool(toolUse, testSessionId);

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, 'new.txt'), 'utf-8');
      expect(written).toBe('New content');
      expect(mockGitService.commitChanges).toHaveBeenCalledWith('Update new.txt', 'testuser');
    });

    it('should create nested directories', async () => {
      const toolUse = {
        name: 'Write',
        input: {
          file_path: 'dir/subdir/nested.txt',
          content: 'Nested content'
        }
      };

      sessionService.setUsername(testSessionId, 'testuser');
      const result = await claudeService.executeTool(toolUse, testSessionId);

      expect(result.success).toBe(true);
      const written = await fs.readFile(path.join(testDir, 'dir/subdir/nested.txt'), 'utf-8');
      expect(written).toBe('Nested content');
    });
  });

  describe('executeTool - Edit', () => {
    it('should execute Edit tool successfully', async () => {
      const filePath = 'edit.txt';
      await fs.writeFile(path.join(testDir, filePath), 'color: red;');

      const toolUse = {
        name: 'Edit',
        input: {
          file_path: filePath,
          old_string: 'red',
          new_string: 'blue'
        }
      };

      sessionService.setUsername(testSessionId, 'testuser');
      const result = await claudeService.executeTool(toolUse, testSessionId);

      expect(result.success).toBe(true);
      const edited = await fs.readFile(path.join(testDir, filePath), 'utf-8');
      expect(edited).toBe('color: blue;');
      expect(mockGitService.commitChanges).toHaveBeenCalledWith('Edit edit.txt', 'testuser');
    });

    it('should throw error when string not found', async () => {
      const filePath = 'edit.txt';
      await fs.writeFile(path.join(testDir, filePath), 'content');

      const toolUse = {
        name: 'Edit',
        input: {
          file_path: filePath,
          old_string: 'notfound',
          new_string: 'replacement'
        }
      };

      sessionService.setUsername(testSessionId, 'testuser');
      await expect(claudeService.executeTool(toolUse, testSessionId)).rejects.toThrow(/not found/);
    });
  });

  describe('executeTool - Bash', () => {
    it('should execute bash command successfully', async () => {
      const toolUse = {
        name: 'Bash',
        input: { command: 'echo "Hello from bash"' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.stdout).toContain('Hello from bash');
    });

    it('should execute command in demo-site directory', async () => {
      const toolUse = {
        name: 'Bash',
        input: { command: 'pwd' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.stdout).toContain(testDir);
    });

    it('should handle command errors', async () => {
      const toolUse = {
        name: 'Bash',
        input: { command: 'nonexistentcommand123' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.error).toBeDefined();
    });

    it('should timeout after 30 seconds', async () => {
      const toolUse = {
        name: 'Bash',
        input: { command: 'sleep 35' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.error).toBeDefined();
      expect(result.error).toContain('sleep 35');
    }, 35000); // 35 second test timeout
  });

  describe('executeTool - Glob', () => {
    it('should find files by pattern', async () => {
      await fs.writeFile(path.join(testDir, 'test1.js'), '');
      await fs.writeFile(path.join(testDir, 'test2.js'), '');
      await fs.writeFile(path.join(testDir, 'test.css'), '');

      const toolUse = {
        name: 'Glob',
        input: { pattern: '*.js' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.files.length).toBe(2);
      expect(result.files).toContain('test1.js');
      expect(result.files).toContain('test2.js');
    });

    it('should return empty array when no matches', async () => {
      const toolUse = {
        name: 'Glob',
        input: { pattern: '*.nonexistent' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.files).toEqual([]);
    });
  });

  describe('executeTool - Grep', () => {
    it('should search for text in files', async () => {
      await fs.writeFile(path.join(testDir, 'test.txt'), 'Hello world\nFoo bar\nHello again');

      const toolUse = {
        name: 'Grep',
        input: { pattern: 'Hello' }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.matches).toContain('Hello world');
      expect(result.matches).toContain('Hello again');
    });

    it('should search in specific path', async () => {
      await fs.mkdir(path.join(testDir, 'subdir'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'subdir', 'nested.txt'), 'FOUND');

      const toolUse = {
        name: 'Grep',
        input: {
          pattern: 'FOUND',
          path: 'subdir'
        }
      };

      const result = await claudeService.executeTool(toolUse);

      expect(result.matches).toContain('FOUND');
    });
  });

  describe('executeTool - Unknown', () => {
    it('should throw error for unknown tool', async () => {
      const toolUse = {
        name: 'UnknownTool',
        input: {}
      };

      await expect(claudeService.executeTool(toolUse))
        .rejects
        .toThrow(/Unknown tool/);
    });
  });

  describe('conversation history', () => {
    it('should start with empty history for new session', () => {
      const history = sessionService.getConversationHistory(testSessionId);
      expect(history).toEqual([]);
    });

    it('should maintain conversation context via session service', () => {
      sessionService.addMessage(testSessionId, 'user', 'Test message');

      const history = sessionService.getConversationHistory(testSessionId);
      expect(history).toHaveLength(1);
      expect(history[0].role).toBe('user');
      expect(history[0].content).toBe('Test message');
    });
  });

  describe('buildMessages', () => {
    it('should build messages from session history', () => {
      sessionService.addMessage(testSessionId, 'user', 'Hello');
      sessionService.addMessage(testSessionId, 'assistant', 'Hi there!');

      const messages = claudeService.buildMessages(testSessionId);

      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual({ role: 'user', content: 'Hello' });
      expect(messages[1]).toEqual({ role: 'assistant', content: 'Hi there!' });
    });
  });
});
