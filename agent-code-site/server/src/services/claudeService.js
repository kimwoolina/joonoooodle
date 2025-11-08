import Anthropic from '@anthropic-ai/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ClaudeService {
  constructor(fileService, socket) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.fileService = fileService;
    this.socket = socket;
    this.conversationHistory = [];
  }

  async processMessage(userMessage, sessionId) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    let fullResponse = '';
    let currentToolUse = null;

    try {
      const stream = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8096,
        system: this.getSystemPrompt(),
        messages: this.conversationHistory,
        tools: this.getTools(),
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_start') {
          if (event.content_block.type === 'text') {
            // Starting a text block
          } else if (event.content_block.type === 'tool_use') {
            currentToolUse = {
              id: event.content_block.id,
              name: event.content_block.name,
              input: {},
            };
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            // Stream text to client
            const text = event.delta.text;
            fullResponse += text;
            this.socket.emit('message:stream', {
              text,
              isComplete: false,
            });
          } else if (event.delta.type === 'input_json_delta') {
            // Accumulate tool input
            if (currentToolUse) {
              currentToolUse.inputJson = (currentToolUse.inputJson || '') + event.delta.partial_json;
            }
          }
        } else if (event.type === 'content_block_stop') {
          if (currentToolUse) {
            // Parse and execute tool
            try {
              currentToolUse.input = JSON.parse(currentToolUse.inputJson);
              const toolResult = await this.executeTool(currentToolUse);

              // Send tool execution notification to client
              this.socket.emit('tool:executed', {
                tool: currentToolUse.name,
                input: currentToolUse.input,
                result: toolResult,
              });

              // Continue conversation with tool result
              await this.continueWithToolResult(currentToolUse, toolResult);
            } catch (error) {
              console.error('Tool execution error:', error);
              this.socket.emit('error', { error: error.message });
            }
            currentToolUse = null;
          }
        } else if (event.type === 'message_stop') {
          // Message complete
          this.socket.emit('message:stream', {
            text: '',
            isComplete: true,
          });
        }
      }

      // Add assistant response to history
      if (fullResponse) {
        this.conversationHistory.push({
          role: 'assistant',
          content: fullResponse,
        });
      }
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  async continueWithToolResult(toolUse, toolResult) {
    // Add assistant's tool use to history
    this.conversationHistory.push({
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

    // Add tool result to history
    this.conversationHistory.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(toolResult),
        },
      ],
    });

    // Continue the conversation
    let fullResponse = '';
    const stream = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8096,
      system: this.getSystemPrompt(),
      messages: this.conversationHistory,
      tools: this.getTools(),
      stream: true,
    });

    let currentToolUse = null;

    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use') {
          currentToolUse = {
            id: event.content_block.id,
            name: event.content_block.name,
            input: {},
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
            currentToolUse.inputJson = (currentToolUse.inputJson || '') + event.delta.partial_json;
          }
        }
      } else if (event.type === 'content_block_stop') {
        if (currentToolUse) {
          try {
            currentToolUse.input = JSON.parse(currentToolUse.inputJson);
            const toolResult = await this.executeTool(currentToolUse);

            this.socket.emit('tool:executed', {
              tool: currentToolUse.name,
              input: currentToolUse.input,
              result: toolResult,
            });

            await this.continueWithToolResult(currentToolUse, toolResult);
          } catch (error) {
            console.error('Tool execution error:', error);
          }
          currentToolUse = null;
        }
      } else if (event.type === 'message_stop') {
        this.socket.emit('message:stream', {
          text: '',
          isComplete: true,
        });
      }
    }

    if (fullResponse) {
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse,
      });
    }
  }

  async executeTool(toolUse) {
    const { name, input } = toolUse;

    switch (name) {
      case 'Read':
        return await this.fileService.readFile(input.file_path);

      case 'Write':
        await this.fileService.writeFile(input.file_path, input.content);
        return { success: true, message: 'File written successfully' };

      case 'Edit':
        await this.fileService.editFile(input.file_path, input.old_string, input.new_string);
        return { success: true, message: 'File edited successfully' };

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
      // Execute in demo site directory
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.fileService.basePath,
        timeout: 30000, // 30 second timeout
      });
      return { stdout, stderr };
    } catch (error) {
      return { error: error.message, stderr: error.stderr, stdout: error.stdout };
    }
  }

  getSystemPrompt() {
    return `You are an AI assistant embedded in a web application demo environment. You can modify a demo website by editing files, creating new files, and running commands.

Current project: A demo website located in the demo-site directory.

You have access to these tools:
- Read: Read file contents
- Write: Create or overwrite files
- Edit: Modify existing files by replacing specific strings
- Bash: Run shell commands (like npm install, etc.)
- Glob: Find files matching patterns
- Grep: Search for text in files

When making changes:
1. Explain what you're doing clearly
2. Show the actual changes you're making
3. Be helpful and educational
4. Handle errors gracefully

File paths should be relative to the demo-site directory (e.g., "index.html", "styles.css", "components/Header.js").

Be conversational and helpful. The user can see the live preview of the website you're modifying.`;
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
              description: 'Path to the file to read (relative to demo-site)',
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
              description: 'Path to the file to write (relative to demo-site)',
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
        description: 'Execute a bash command in the demo site directory',
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
