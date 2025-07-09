# Backend API Testing Guide

This directory contains comprehensive tests for the ToDo App backend API.

## 🧪 Test Structure

```
tests/
├── setup.js              # Test environment setup
├── auth.test.js          # Authentication tests
├── todos.test.js         # Todo CRUD tests
├── server.test.js        # Server-level tests
├── integration.test.js   # End-to-end workflow tests
└── README.md             # This file
```

## 🚀 Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run only authentication tests
npm test -- auth.test.js

# Run only todo tests
npm test -- todos.test.js

# Run only integration tests
npm test -- integration.test.js
```

## 📋 Test Categories

### 1. Authentication Tests (`auth.test.js`)
- User registration
- User login
- Token refresh
- User logout
- Current user retrieval
- Input validation
- Error handling

### 2. Todo Tests (`todos.test.js`)
- Create todos
- Read todos (single and list)
- Update todos
- Delete todos
- Toggle completion
- Filtering and sorting
- Statistics
- Authorization

### 3. Server Tests (`server.test.js`)
- Health check endpoint
- 404 error handling
- CORS configuration
- Rate limiting

### 4. Integration Tests (`integration.test.js`)
- Complete user workflows
- Error scenarios
- Data isolation between users
- End-to-end functionality

## 🔧 Test Environment

### MongoDB Memory Server
- Uses `mongodb-memory-server` for isolated testing
- No external database required
- Automatic cleanup between tests

### Environment Variables
Test environment automatically sets:
```env
MONGODB_URI=mongodb://localhost:memory
JWT_SECRET=test-jwt-secret-key
JWT_REFRESH_SECRET=test-refresh-jwt-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=test
```

### Test Utilities
Global test utilities available:
- `generateTestUser()` - Generate test user data
- `generateTestTodo()` - Generate test todo data
- `createTestUser()` - Create authenticated test user

## 📊 Test Coverage

The tests cover:
- ✅ All API endpoints
- ✅ Authentication flows
- ✅ CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ Authorization
- ✅ Data isolation
- ✅ Edge cases

## 🐛 Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
npm test -- --testNamePattern="should register a new user"
```

### Run Tests with Console Output
```bash
npm test -- --silent=false
```

## 📝 Writing New Tests

### Test Structure
```javascript
describe('Feature Name', () => {
  let testUser;
  
  beforeEach(async () => {
    testUser = await global.testUtils.createTestUser(app);
  });

  it('should do something', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send(data)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Best Practices
1. **Use descriptive test names**
2. **Test both success and failure cases**
3. **Verify response structure**
4. **Test authorization**
5. **Use test utilities for common operations**
6. **Clean up data between tests**

## 🔍 Test Examples

### Authentication Test
```javascript
it('should register a new user successfully', async () => {
  const userData = global.testUtils.generateTestUser();
  
  const response = await request(app)
    .post('/api/auth/register')
    .send(userData)
    .expect(201);

  expect(response.body.success).toBe(true);
  expect(response.body.data.user.email).toBe(userData.email);
});
```

### Protected Route Test
```javascript
it('should create todo with authentication', async () => {
  const testUser = await global.testUtils.createTestUser(app);
  const todoData = global.testUtils.generateTestTodo();

  const response = await request(app)
    .post('/api/todos')
    .set('Authorization', `Bearer ${testUser.accessToken}`)
    .send(todoData)
    .expect(201);

  expect(response.body.data.title).toBe(todoData.title);
});
```

## 🚨 Common Issues

### MongoDB Connection
- Ensure `mongodb-memory-server` is installed
- Check test timeout settings
- Verify environment variables

### JWT Tokens
- Use test-specific JWT secrets
- Handle token expiration in tests
- Test refresh token functionality

### Async Operations
- Use `async/await` properly
- Handle promises correctly
- Set appropriate timeouts

## 📈 Performance

### Test Execution Time
- Individual tests: ~100-500ms
- Full test suite: ~10-30 seconds
- Coverage report: ~5-10 seconds

### Optimization Tips
- Use `beforeAll` for expensive setup
- Use `beforeEach` for data cleanup
- Avoid unnecessary API calls
- Mock external services when possible

## 🔗 Related Files

- `jest.config.js` - Jest configuration
- `package.json` - Test scripts and dependencies
- `server.js` - Main application file
- `models/` - Database models
- `routes/` - API routes
- `middleware/` - Custom middleware

## 📞 Support

For test-related issues:
1. Check the test output for specific errors
2. Verify all dependencies are installed
3. Ensure MongoDB memory server is working
4. Review test environment setup 