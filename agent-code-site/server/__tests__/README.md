# Backend Unit Tests

This directory contains unit tests for the backend server components.

## Setup

Install test dependencies:

```bash
npm install
```

This will install:
- **jest** - Testing framework
- **@jest/globals** - Jest global functions for ES modules
- **supertest** - HTTP endpoint testing
- **socket.io-client** - Socket.io client for testing WebSocket events

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- fileService.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="Read tool"
```

## Test Files

### `fileService.test.js`
**Status:** ✅ Ready to run
**Coverage:** File system operations (read, write, edit, glob, grep, watch)

Tests all FileService methods with temporary test directories. No mocking required.

**Test Count:** ~25 tests
**Priority:** HIGH

### `claudeService.test.js`
**Status:** ⚠️ Requires Anthropic SDK mock implementation
**Coverage:** Tool execution, conversation history, system prompt

Tests Claude service tool execution logic without making real API calls.

**Test Count:** ~30 tests
**Priority:** HIGH
**Note:** Requires proper mocking of `@anthropic-ai/sdk`

### `server.test.js`
**Status:** ⚠️ Requires server refactoring
**Coverage:** HTTP endpoints, Socket.io events

Integration tests for Express routes and WebSocket communication.

**Test Count:** ~15 tests
**Priority:** MEDIUM
**Note:** Requires server.js refactoring to export app and server instances

## Test Structure

```
__tests__/
├── fileService.test.js      # FileService unit tests (ready)
├── claudeService.test.js    # ClaudeService unit tests (needs mocking)
├── server.test.js           # Server integration tests (needs refactoring)
├── fixtures/                # Test data (to be created)
│   ├── test-files/
│   └── mock-responses/
└── README.md                # This file
```

## Writing New Tests

### Basic Test Template

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      const input = 'test';

      // Act
      const result = await someMethod(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Async Operations

```javascript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Errors

```javascript
it('should throw error for invalid input', async () => {
  await expect(functionThatThrows())
    .rejects
    .toThrow('Error message');
});
```

### Using Temporary Files

```javascript
beforeEach(async () => {
  testDir = path.join(__dirname, 'temp-test');
  await fs.mkdir(testDir, { recursive: true });
});

afterEach(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});
```

## Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| FileService | 90% | - |
| ClaudeService | 80% | - |
| Server | 75% | - |
| **Overall** | **80%** | - |

## Continuous Integration

To add tests to CI/CD pipeline, create `.github/workflows/test.yml`:

```yaml
name: Backend Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: cd server && npm install

    - name: Run tests
      run: cd server && npm test

    - name: Generate coverage report
      run: cd server && npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        directory: ./server/coverage
```

## Troubleshooting

### ES Modules Error
If you see `Cannot use import statement outside a module`:
- Ensure `"type": "module"` is in package.json
- Use `node --experimental-vm-modules` flag in test scripts

### Mock Not Working
For mocking external dependencies:
```javascript
jest.mock('@anthropic-ai/sdk');
```

### File Permission Errors
Ensure test directories are cleaned up:
```javascript
afterEach(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});
```

### Timeout Errors
Increase timeout for long-running tests:
```javascript
it('should handle long operation', async () => {
  // test code
}, 30000); // 30 second timeout
```

## Best Practices

1. **Isolation** - Each test should be independent
2. **Cleanup** - Always clean up temp files and resources
3. **Descriptive Names** - Use clear test descriptions
4. **Arrange-Act-Assert** - Structure tests clearly
5. **Edge Cases** - Test error conditions and edge cases
6. **Mocking** - Mock external dependencies (APIs, databases)
7. **Coverage** - Aim for high coverage but focus on quality

## Next Steps

1. ✅ Install test dependencies (`npm install`)
2. ✅ Run FileService tests (`npm test fileService.test.js`)
3. ⚠️ Implement Anthropic SDK mock for ClaudeService tests
4. ⚠️ Refactor server.js to enable integration tests
5. 📊 Review coverage report (`npm run test:coverage`)
6. 🚀 Add CI/CD pipeline

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Socket.io Testing](https://socket.io/docs/v4/testing/)
- [ES Modules in Jest](https://jestjs.io/docs/ecmascript-modules)
