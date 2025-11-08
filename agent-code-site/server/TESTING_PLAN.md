# Backend Testing Plan

## Testing Strategy

The backend consists of three main components that need testing:
1. **FileService** - File system operations (easiest to test)
2. **ClaudeService** - Claude API integration (requires mocking)
3. **Server** - Express + Socket.io (integration tests)

## Test Framework Setup

### Dependencies to Install

```bash
npm install --save-dev jest @jest/globals
npm install --save-dev supertest  # For HTTP endpoint testing
npm install --save-dev socket.io-client  # For Socket.io testing
```

### Jest Configuration

Add to `package.json`:
```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
  }
}
```

Create `jest.config.js`:
```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

## Unit Tests to Write

### 1. FileService Tests (`__tests__/fileService.test.js`)

**Test Coverage:**
- ✅ Read file successfully
- ✅ Read non-existent file (error handling)
- ✅ Write file successfully
- ✅ Write file with nested directories (auto-create)
- ✅ Edit file - replace string successfully
- ✅ Edit file - string not found (error handling)
- ✅ Edit file - non-existent file (error handling)
- ✅ Get file tree structure
- ✅ Get file tree for subdirectory
- ✅ Check file exists (true/false)
- ✅ Glob pattern matching
- ✅ Grep text search
- ✅ File watching - detect changes
- ✅ File watching - stop watching

**Complexity:** LOW
**Priority:** HIGH (core functionality)

---

### 2. ClaudeService Tests (`__tests__/claudeService.test.js`)

**Test Coverage:**
- ✅ Initialize service with correct configuration
- ✅ Execute Read tool
- ✅ Execute Write tool
- ✅ Execute Edit tool
- ✅ Execute Bash tool
- ✅ Execute Glob tool
- ✅ Execute Grep tool
- ✅ Unknown tool returns error
- ✅ Bash command timeout after 30 seconds
- ✅ Bash commands run in demo-site directory
- ✅ System prompt generation
- ✅ Tools schema generation
- ✅ Conversation history management
- ✅ Process message adds to history
- ✅ Tool results formatted correctly

**Complexity:** MEDIUM (requires mocking Anthropic SDK)
**Priority:** HIGH (business logic)

**Mocking Strategy:**
- Mock `@anthropic-ai/sdk` to avoid real API calls
- Mock `socket.io` to verify events emitted
- Use real FileService with temporary test directory

---

### 3. Server Tests (`__tests__/server.test.js`)

**Test Coverage:**

**HTTP Endpoints:**
- ✅ GET /api/health returns 200
- ✅ GET /api/files returns file tree
- ✅ GET /api/files/:path returns file content
- ✅ GET /api/files/:path returns 404 for missing file
- ✅ GET /demo serves static files
- ✅ CORS headers present

**Socket.io Events:**
- ✅ Connection event handled
- ✅ message:send triggers Claude processing
- ✅ message:stream events emitted
- ✅ tool:executed events emitted
- ✅ file:changed events emitted on file modification
- ✅ files:watch starts file watcher
- ✅ files:unwatch stops file watcher
- ✅ Disconnect event handled

**Complexity:** MEDIUM-HIGH (integration tests)
**Priority:** MEDIUM

---

## Test File Structure

```
server/
├── src/
│   ├── server.js
│   └── services/
│       ├── claudeService.js
│       └── fileService.js
├── __tests__/
│   ├── fileService.test.js
│   ├── claudeService.test.js
│   ├── server.test.js
│   └── fixtures/
│       ├── test-files/
│       │   ├── sample.html
│       │   ├── sample.css
│       │   └── sample.js
│       └── mock-responses/
│           └── claude-streaming.json
├── jest.config.js
└── package.json
```

## Testing Best Practices

### 1. Use Test Fixtures
- Create sample files in `__tests__/fixtures/`
- Use temporary directories for write operations
- Clean up after each test

### 2. Mock External Dependencies
- Mock Anthropic API calls
- Mock Socket.io connections
- Use dependency injection where possible

### 3. Test Error Cases
- File not found
- Permission errors
- API failures
- Timeout scenarios
- Invalid input

### 4. Test Edge Cases
- Empty files
- Large files
- Special characters in filenames
- Concurrent operations

### 5. Isolation
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/teardown
- Don't rely on test execution order

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| FileService | 90%+ |
| ClaudeService (without API) | 80%+ |
| Server | 75%+ |
| **Overall** | **80%+** |

## Integration Tests (Future)

Beyond unit tests, consider:
1. **End-to-End Tests** - Full user flow with real Claude API
2. **Performance Tests** - Streaming latency, file watching overhead
3. **Load Tests** - Multiple concurrent users
4. **Security Tests** - Path traversal, command injection

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- fileService.test.js

# Run tests matching pattern
npm test -- --testNamePattern="Read tool"
```

## CI/CD Integration

Add to GitHub Actions workflow:
```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd server && npm install
      - run: cd server && npm test
      - run: cd server && npm run test:coverage
```

## Test Prioritization

**Phase 1: Core Functionality (Week 1)**
- ✅ FileService tests (all methods)
- ✅ Basic ClaudeService tool execution

**Phase 2: Service Logic (Week 2)**
- ✅ ClaudeService conversation history
- ✅ Server HTTP endpoints

**Phase 3: Integration (Week 3)**
- ✅ Socket.io event handling
- ✅ File watching integration

**Phase 4: Polish (Week 4)**
- ✅ Error scenarios
- ✅ Edge cases
- ✅ Coverage optimization
