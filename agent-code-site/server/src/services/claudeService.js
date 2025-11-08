import Anthropic from '@anthropic-ai/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ClaudeService {
  constructor(fileService, gitService, sessionService, socket) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.fileService = fileService;
    this.gitService = gitService;
    this.sessionService = sessionService;
    this.socket = socket;
  }

  async processMessage(userMessage, sessionId) {
    // Get session
    const session = this.sessionService.getOrCreateSession(sessionId);

    // Add user message to session history
    this.sessionService.addMessage(sessionId, 'user', userMessage);

    // Create abort controller for this request
    const abortController = new AbortController();
    this.sessionService.registerActiveRequest(sessionId, abortController);

    let fullResponse = '';
    let currentToolUse = null;
    let currentContentBlockType = null;

    try {
      const stream = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8096,
        system: this.getSystemPrompt(),
        messages: this.buildMessages(sessionId),
        tools: this.getTools(),
        stream: true,
      }, {
        signal: abortController.signal,
      });

      for await (const event of stream) {
        // Check if aborted
        if (abortController.signal.aborted) {
          this.socket.emit('message:cancelled', {});
          break;
        }

        if (event.type === 'content_block_start') {
          currentContentBlockType = event.content_block.type;
          if (event.content_block.type === 'tool_use') {
            currentToolUse = {
              id: event.content_block.id,
              name: event.content_block.name,
              input: {},
              inputJson: '',
            };
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            // Stream conversational text to client
            const text = event.delta.text;
            fullResponse += text;
            this.socket.emit('message:stream', {
              text,
              isComplete: false,
            });
          } else if (event.delta.type === 'input_json_delta') {
            if (currentToolUse) {
              currentToolUse.inputJson += event.delta.partial_json;
            }
          }
        } else if (event.type === 'content_block_stop') {
          if (currentToolUse) {
            try {
              currentToolUse.input = JSON.parse(currentToolUse.inputJson);

              // Execute tool silently (don't show to user)
              const toolResult = await this.executeTool(currentToolUse, sessionId);

              // Continue conversation with tool result
              await this.continueWithToolResult(currentToolUse, toolResult, sessionId, abortController);
            } catch (error) {
              console.error('Tool execution error:', error);
              this.socket.emit('error', { error: error.message });
            }
            currentToolUse = null;
          } else if (currentContentBlockType === 'text') {
            // Text block complete - finalize this message
            this.socket.emit('message:stream', {
              text: '',
              isComplete: true,
            });
          }
          currentContentBlockType = null;
        } else if (event.type === 'message_stop') {
          this.socket.emit('message:stream', {
            text: '',
            isComplete: true,
          });
        }
      }

      // Add assistant response to session history
      if (fullResponse) {
        this.sessionService.addMessage(sessionId, 'assistant', fullResponse);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted by user');
      } else {
        console.error('Claude API error:', error);
        throw error;
      }
    } finally {
      // Clear active request
      this.sessionService.clearActiveRequest(sessionId);
    }
  }

  async continueWithToolResult(toolUse, toolResult, sessionId, abortController) {
    // Build message history with tool use and result
    const messages = this.buildMessages(sessionId);

    // Add tool use
    messages.push({
      role: 'assistant',
      content: [
        {
          type: 'tool_use',
          id: toolUse.id,
          name: toolUse.name,
          input: toolUse.input,
        },
      ],
    });

    // Add tool result
    messages.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult),
        },
      ],
    });

    let fullResponse = '';
    const stream = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8096,
      system: this.getSystemPrompt(),
      messages,
      tools: this.getTools(),
      stream: true,
    }, {
      signal: abortController.signal,
    });

    let currentToolUse = null;
    let currentContentBlockType = null;

    for await (const event of stream) {
      if (abortController.signal.aborted) {
        break;
      }

      if (event.type === 'content_block_start') {
        currentContentBlockType = event.content_block.type;
        if (event.content_block.type === 'tool_use') {
          currentToolUse = {
            id: event.content_block.id,
            name: event.content_block.name,
            input: {},
            inputJson: '',
          };
        }
      } else if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          const text = event.delta.text;
          fullResponse += text;
          this.socket.emit('message:stream', {
            text,
            isComplete: false,
          });
        } else if (event.delta.type === 'input_json_delta') {
          if (currentToolUse) {
            currentToolUse.inputJson += event.delta.partial_json;
          }
        }
      } else if (event.type === 'content_block_stop') {
        if (currentToolUse) {
          try {
            currentToolUse.input = JSON.parse(currentToolUse.inputJson);
            const toolResult = await this.executeTool(currentToolUse, sessionId);
            await this.continueWithToolResult(currentToolUse, toolResult, sessionId, abortController);
          } catch (error) {
            console.error('Tool execution error:', error);
          }
          currentToolUse = null;
        } else if (currentContentBlockType === 'text') {
          // Text block complete - finalize this message
          this.socket.emit('message:stream', {
            text: '',
            isComplete: true,
          });
        }
        currentContentBlockType = null;
      } else if (event.type === 'message_stop') {
        this.socket.emit('message:stream', {
          text: '',
          isComplete: true,
        });
      }
    }

    if (fullResponse) {
      this.sessionService.addMessage(sessionId, 'assistant', fullResponse);
    }
  }

  async executeTool(toolUse, sessionId) {
    const { name, input } = toolUse;

    switch (name) {
      case 'Read':
        return await this.fileService.readFile(input.file_path);

      case 'Write':
        await this.fileService.writeFile(input.file_path, input.content);
        // Commit change to active branch
        const username = this.sessionService.getUsername(sessionId);
        await this.gitService.commitChanges(`Update ${input.file_path}`, username);
        return { success: true, message: 'File written and committed' };

      case 'Edit':
        await this.fileService.editFile(input.file_path, input.old_string, input.new_string);
        const user = this.sessionService.getUsername(sessionId);
        await this.gitService.commitChanges(`Edit ${input.file_path}`, user);
        return { success: true, message: 'File edited and committed' };

      case 'Bash':
        return await this.executeBash(input.command);

      case 'Glob':
        return await this.fileService.glob(input.pattern);

      case 'Grep':
        return await this.fileService.grep(input.pattern, input.path);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async executeBash(command) {
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.fileService.basePath,
        timeout: 30000,
      });
      return { stdout, stderr };
    } catch (error) {
      return { error: error.message, stderr: error.stderr, stdout: error.stdout };
    }
  }

  buildMessages(sessionId) {
    const history = this.sessionService.getConversationHistory(sessionId);
    return history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  getSystemPrompt() {
    return `You are a helpful AI assistant embedded in a website builder application. Users can ask you to modify and enhance their website, and you have the tools to make those changes.

IMPORTANT INTERACTION STYLE:
- Be conversational and friendly, NOT technical
- Don't mention file names, tools, or technical implementation details
- Focus on WHAT you're doing, not HOW
- Keep responses concise and user-friendly
- ALWAYS end by telling users their changes are ready in the preview

Examples:
❌ "I'm using the Edit tool to modify styles.css and change the background-color property..."
✅ "Working on changing the background color..."

❌ "I'll use the Write tool to create a new file called dark-mode.js..."
✅ "Adding dark mode functionality..."

❌ "Let me use the Glob tool to find all CSS files..."
✅ "Let me check the current styling..."

✅ GOOD ENDINGS:
"Done! Your changes are ready - check the preview to see the new background color!"
"All set! The header is now green. You can see it in the preview on the right."
"Changes complete! Take a look at the preview to see the new design."

You have access to these tools (but don't mention them to the user):
- Read: Read file contents
- Write: Create or overwrite files
- Edit: Modify existing files
- Bash: Run commands (like npm install)
- Glob: Find files
- Grep: Search for text

When users ask for changes:
1. Acknowledge their request conversationally
2. Work on it (use tools silently)
3. When complete, ALWAYS tell them to check the preview

Be helpful, clear, and educational. Focus on the user experience, not the technical details.`;
  }

  getTools() {
    return [
      {
        name: 'Read',
        description: 'Read the contents of a file',
        input_schema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the file to read (relative to main-site)',
            },
          },
          required: ['file_path'],
        },
      },
      {
        name: 'Write',
        description: 'Write content to a file (creates new file or overwrites existing)',
        input_schema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the file to write (relative to main-site)',
            },
            content: {
              type: 'string',
              description: 'Content to write to the file',
            },
          },
          required: ['file_path', 'content'],
        },
      },
      {
        name: 'Edit',
        description: 'Edit a file by replacing old_string with new_string',
        input_schema: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Path to the file to edit',
            },
            old_string: {
              type: 'string',
              description: 'The exact string to replace',
            },
            new_string: {
              type: 'string',
              description: 'The new string to insert',
            },
          },
          required: ['file_path', 'old_string', 'new_string'],
        },
      },
      {
        name: 'Bash',
        description: 'Execute a bash command in the website directory',
        input_schema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The bash command to execute',
            },
          },
          required: ['command'],
        },
      },
      {
        name: 'Glob',
        description: 'Find files matching a glob pattern',
        input_schema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              description: 'Glob pattern (e.g., "*.js", "**/*.css")',
            },
          },
          required: ['pattern'],
        },
      },
      {
        name: 'Grep',
        description: 'Search for text in files',
        input_schema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              description: 'Text or regex pattern to search for',
            },
            path: {
              type: 'string',
              description: 'Path to search in (optional, defaults to all files)',
            },
          },
          required: ['pattern'],
        },
      },
    ];
  }
}
