const request = require('supertest');
const app = require('../server');
const Todo = require('../models/Todo');

describe('Todo Endpoints', () => {
    let testUser;
    let authToken;

    beforeEach(async () => {
        testUser = await global.testUtils.createTestUser(app);
        authToken = testUser.accessToken;
    });

    describe('GET /api/todos', () => {
        beforeEach(async () => {
            // Create some test todos
            const todos = [
                global.testUtils.generateTestTodo({ title: 'Todo 1', priority: 'high', completed: false }),
                global.testUtils.generateTestTodo({ title: 'Todo 2', priority: 'medium', completed: true }),
                global.testUtils.generateTestTodo({ title: 'Todo 3', priority: 'low', completed: false })
            ];

            for (const todo of todos) {
                await request(app)
                    .post('/api/todos')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(todo);
            }
        });

        it('should get all todos for authenticated user', async () => {
            const response = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(3);
        });

        it('should filter todos by completion status', async () => {
            const response = await request(app)
                .get('/api/todos?completed=false')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data.every(todo => !todo.completed)).toBe(true);
        });

        it('should filter todos by priority', async () => {
            const response = await request(app)
                .get('/api/todos?priority=high')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].priority).toBe('high');
        });

        it('should sort todos by creation date', async () => {
            const response = await request(app)
                .get('/api/todos?sortBy=createdAt&sortOrder=desc')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(3);
        });

        it('should return error without authentication', async () => {
            const response = await request(app)
                .get('/api/todos')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Access denied. No token provided.');
        });
    });

    describe('POST /api/todos', () => {
        it('should create a new todo successfully', async () => {
            const todoData = global.testUtils.generateTestTodo();

            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Todo created successfully');
            expect(response.body.data).toBeDefined();
            expect(response.body.data.title).toBe(todoData.title);
            expect(response.body.data.description).toBe(todoData.description);
            expect(response.body.data.priority).toBe(todoData.priority);
            expect(response.body.data.completed).toBe(false);
            expect(response.body.data.user).toBe(testUser.user.id);
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should validate title length', async () => {
            const todoData = global.testUtils.generateTestTodo({
                title: 'a'.repeat(201) // Too long
            });

            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should validate priority values', async () => {
            const todoData = global.testUtils.generateTestTodo({
                priority: 'invalid'
            });

            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });

        it('should return error without authentication', async () => {
            const todoData = global.testUtils.generateTestTodo();

            const response = await request(app)
                .post('/api/todos')
                .send(todoData)
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/todos/:id', () => {
        let todoId;

        beforeEach(async () => {
            const todoData = global.testUtils.generateTestTodo();
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData);

            todoId = response.body.data._id;
        });

        it('should get a specific todo by ID', async () => {
            const response = await request(app)
                .get(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data._id).toBe(todoId);
        });

        it('should return 404 for non-existent todo', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .get(`/api/todos/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Todo not found');
        });

        it('should return error without authentication', async () => {
            const response = await request(app)
                .get(`/api/todos/${todoId}`)
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/todos/:id', () => {
        let todoId;

        beforeEach(async () => {
            const todoData = global.testUtils.generateTestTodo();
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData);

            todoId = response.body.data._id;
        });

        it('should update a todo successfully', async () => {
            const updateData = {
                title: 'Updated Todo',
                description: 'Updated description',
                priority: 'high',
                completed: true
            };

            const response = await request(app)
                .put(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Todo updated successfully');
            expect(response.body.data.title).toBe(updateData.title);
            expect(response.body.data.description).toBe(updateData.description);
            expect(response.body.data.priority).toBe(updateData.priority);
            expect(response.body.data.completed).toBe(updateData.completed);
        });

        it('should return 404 for non-existent todo', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .put(`/api/todos/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated' })
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Todo not found');
        });

        it('should validate update data', async () => {
            const response = await request(app)
                .put(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ priority: 'invalid' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('DELETE /api/todos/:id', () => {
        let todoId;

        beforeEach(async () => {
            const todoData = global.testUtils.generateTestTodo();
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData);

            todoId = response.body.data._id;
        });

        it('should delete a todo successfully', async () => {
            const response = await request(app)
                .delete(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Todo deleted successfully');

            // Verify todo is deleted
            const getResponse = await request(app)
                .get(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });

        it('should return 404 for non-existent todo', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .delete(`/api/todos/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Todo not found');
        });
    });

    describe('PATCH /api/todos/:id/toggle', () => {
        let todoId;

        beforeEach(async () => {
            const todoData = global.testUtils.generateTestTodo();
            const response = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${authToken}`)
                .send(todoData);

            todoId = response.body.data._id;
        });

        it('should toggle todo completion status', async () => {
            // Initially should be false
            let response = await request(app)
                .get(`/api/todos/${todoId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.body.data.completed).toBe(false);

            // Toggle to true
            response = await request(app)
                .patch(`/api/todos/${todoId}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Todo marked as completed');
            expect(response.body.data.completed).toBe(true);

            // Toggle back to false
            response = await request(app)
                .patch(`/api/todos/${todoId}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Todo marked as incomplete');
            expect(response.body.data.completed).toBe(false);
        });

        it('should return 404 for non-existent todo', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const response = await request(app)
                .patch(`/api/todos/${fakeId}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Todo not found');
        });
    });

    describe('GET /api/todos/stats/summary', () => {
        beforeEach(async () => {
            // Create todos with different statuses and priorities
            const todos = [
                { title: 'High Priority', priority: 'high', completed: false },
                { title: 'Medium Priority', priority: 'medium', completed: true },
                { title: 'Low Priority', priority: 'low', completed: false },
                { title: 'Another High', priority: 'high', completed: true }
            ];

            for (const todo of todos) {
                await request(app)
                    .post('/api/todos')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(todo);
            }
        });

        it('should return todo statistics', async () => {
            const response = await request(app)
                .get('/api/todos/stats/summary')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.total).toBe(4);
            expect(response.body.data.completed).toBe(2);
            expect(response.body.data.pending).toBe(2);
            expect(response.body.data.highPriority).toBe(2);
            expect(response.body.data.mediumPriority).toBe(1);
            expect(response.body.data.lowPriority).toBe(1);
        });

        it('should return error without authentication', async () => {
            const response = await request(app)
                .get('/api/todos/stats/summary')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
}); 