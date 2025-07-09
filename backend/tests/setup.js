const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Connect to the in-memory database before running tests
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Set environment variables for testing
    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'test-jwt-secret-key';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-jwt-secret-key';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
    process.env.NODE_ENV = 'test';

    // Disconnect any existing connections first
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}, 30000);

// Clear all data between tests
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

// Disconnect and stop mongod after all tests
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongod) {
        await mongod.stop();
    }
}, 30000);

// Global test utilities
global.testUtils = {
    // Generate test user data
    generateTestUser: (overrides = {}) => ({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        ...overrides
    }),

    // Generate test todo data
    generateTestTodo: (overrides = {}) => ({
        title: 'Test Todo',
        description: 'Test description',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        completed: false,
        ...overrides
    }),

    // Create a test user and return user data with tokens
    createTestUser: async (app, userData = {}) => {
        const request = require('supertest');
        const testUser = global.testUtils.generateTestUser(userData);
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        return {
            user: response.body.data.user,
            accessToken: response.body.data.accessToken,
            refreshToken: response.body.data.refreshToken,
            credentials: testUser
        };
    }
};