# Testing Quick Start Guide

Get up and running with backend tests in 5 minutes.

## 1. Install Dependencies

```bash
cd server
npm install
```

This installs Jest and testing dependencies defined in package.json.

## 2. Run Your First Test

```bash
npm test
```

This will run all tests in the `__tests__/` directory.

## 3. See What Tests Are Available

The test suite includes:

### ✅ FileService Tests (Ready to Run)
Tests for file operations - fully functional and ready to use.

```bash
npm test -- fileService.test.js
```

**What it tests:**
- Reading files
- Writing files with auto-directory creation
- Editing files (string replacement)
- Getting file tree structure
- Glob pattern matching
- Grep text search
- File watching for changes

**Example test output:**
```
FileService
  ✓ should read file contents successfully (15ms)
  ✓ should write file successfully (12ms)
  ✓ should replace string successfully (18ms)
  ...
```

### ⚠️ ClaudeService Tests (Needs Setup)
Tests for Claude API integration - requires mock implementation.

```bash
npm test -- claudeService.test.js
```

**Status:** Requires proper mocking of Anthropic SDK
**See:** TESTING_PLAN.md for mock setup instructions

### ⚠️ Server Tests (Needs Refactoring)
Integration tests for HTTP and WebSocket endpoints.

```bash
npm test -- server.test.js
```

**Status:** Requires server.js refactoring to export app/server
**See:** server.test.js comments for refactoring approach

## 4. Watch Mode (Development)

Run tests automatically when files change:

```bash
npm run test:watch
```

This is perfect for TDD (Test-Driven Development). Edit a test or source file, and tests re-run automatically.

## 5. Coverage Report

See how much of your code is covered by tests:

```bash
npm run test:coverage
```

**Example output:**
```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.12 |    78.45 |   88.23 |   85.67 |
 fileService.js     |   92.45 |    87.50 |   95.00 |   93.12 |
 claudeService.js   |   78.34 |    68.75 |   82.14 |   79.45 |
--------------------|---------|----------|---------|---------|
```

Coverage reports are also generated as HTML in `coverage/lcov-report/index.html`.

## 6. Common Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- fileService.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="Read"

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Run tests with verbose output
npm test -- --verbose

# Run only failed tests from last run
npm test -- --onlyFailures
```

## Example: Writing Your First Test

Let's say you want to test a new method in FileService:

```javascript
// __tests__/myNewTest.test.js
import { describe, it, expect } from '@jest/globals';
import { FileService } from '../src/services/fileService.js';

describe('My New Feature', () => {
  it('should do something amazing', async () => {
    const fileService = new FileService('/tmp/test');

    const result = await fileService.someMethod();

    expect(result).toBe('amazing');
  });
});
```

Run it:
```bash
npm test -- myNewTest.test.js
```

## Test Results Interpretation

### ✅ Passing Test
```
✓ should read file contents successfully (15ms)
```
Everything works as expected!

### ❌ Failing Test
```
✕ should read file contents successfully (25ms)

  expect(received).toBe(expected)

  Expected: "Hello, world!"
  Received: "Hello world"
```
The test shows exactly what went wrong and where.

### ⚠️ Skipped Test
```
○ skipped should test future feature
```
Test is defined but skipped (using `it.skip()` or `xit()`).

## Debugging Tests

### Add console.log
```javascript
it('should work', async () => {
  const result = await someFunction();
  console.log('Result:', result); // Debug output
  expect(result).toBe('expected');
});
```

### Run single test
```javascript
it.only('should test this one thing', async () => {
  // Only this test runs
});
```

### Increase timeout for slow tests
```javascript
it('should handle slow operation', async () => {
  // test code
}, 30000); // 30 second timeout instead of default 5s
```

## What Makes a Good Test?

### ✅ Good Test
```javascript
it('should return uppercase string when input is lowercase', () => {
  const input = 'hello';
  const result = toUpperCase(input);
  expect(result).toBe('HELLO');
});
```
- Clear description
- Single responsibility
- Easy to understand
- Tests behavior, not implementation

### ❌ Bad Test
```javascript
it('should work', () => {
  const x = doStuff();
  expect(x).toBeTruthy();
});
```
- Vague description
- Unclear what's being tested
- Weak assertion

## Troubleshooting

### Error: "Cannot find module"
**Solution:** Make sure you're in the `/server` directory:
```bash
cd server
npm install
npm test
```

### Error: "Cannot use import statement outside a module"
**Solution:** Already configured! The `--experimental-vm-modules` flag is in package.json scripts.

### Error: "ENOENT: no such file or directory"
**Solution:** Tests create temp directories. Make sure cleanup in `afterEach()` is working:
```javascript
afterEach(async () => {
  await fs.rm(testDir, { recursive: true, force: true });
});
```

### Tests are slow
**Solution:**
- Use `it.only()` to run single test
- Use `npm run test:watch` for faster feedback
- Check for unnecessary `await` calls

## Next Steps

1. ✅ Run `npm test` to see all tests
2. ✅ Run `npm run test:coverage` to see coverage
3. 📝 Read TESTING_PLAN.md for complete testing strategy
4. 🔧 Implement Anthropic SDK mock for ClaudeService tests
5. 🏗️ Refactor server.js for integration testing
6. 🚀 Add tests to CI/CD pipeline

## Resources

- **TESTING_PLAN.md** - Comprehensive testing strategy
- **__tests__/README.md** - Detailed test documentation
- [Jest Docs](https://jestjs.io/) - Official Jest documentation
- [Testing Best Practices](https://jestjs.io/docs/testing-recipes) - Common patterns

## Questions?

Check these files:
- `TESTING_PLAN.md` - Overall testing strategy
- `__tests__/README.md` - Detailed test documentation
- `jest.config.js` - Jest configuration
- Individual test files for examples

Happy testing! 🧪
