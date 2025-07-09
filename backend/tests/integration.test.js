const request = require('supertest');
const app = require('../server');

describe('Integration Tests', () => {
    describe('Complete User Workflow', () => {
        it('should handle complete user workflow: register -> login -> create todos -> manage todos', async () => {
            // Step 1: Register a new user
            const userData = global.testUtils.generateTestUser();
            let registerResponse = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(registerResponse.body.success).toBe(true);
            const { accessToken, refreshToken } = registerResponse.body.data;

            // Step 2: Login with the same user
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                })
                .expect(200);

            expect(loginResponse.body.success).toBe(true);
            const newAccessToken = loginResponse.body.data.accessToken;
            const newRefreshToken = loginResponse.body.data.refreshToken;

            // Step 3: Create multiple todos
            const todos = [
                { title: 'Buy groceries', description: 'Milk, bread, eggs', priority: 'high' },
                { title: 'Call dentist', description: 'Schedule appointment', priority: 'medium' },
                { title: 'Read book', description: 'Finish chapter 5', priority: 'low' }
            ];

            const createdTodos = [];
            for (const todo of todos) {
                const response = await request(app)
                    .post('/api/todos')
                    .set('Authorization', `Bearer ${newAccessToken}`)
                    .send(todo)
                    .expect(201);

                createdTodos.push(response.body.data);
            }

            expect(createdTodos.length).toBe(3);

            // Step 4: Get all todos
            const getTodosResponse = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(getTodosResponse.body.data.length).toBe(3);

            // Step 5: Update a todo
            const todoToUpdate = createdTodos[0];
            const updateResponse = await request(app)
                .put(`/api/todos/${todoToUpdate._id}`)
                .set('Authorization', `Bearer ${newAccessToken}`)
                .send({
                    title: 'Buy groceries (updated)',
                    completed: true
                })
                .expect(200);

            expect(updateResponse.body.data.title).toBe('Buy groceries (updated)');
            expect(updateResponse.body.data.completed).toBe(true);

            // Step 6: Toggle another todo
            const todoToToggle = createdTodos[1];
            const toggleResponse = await request(app)
                .patch(`/api/todos/${todoToToggle._id}/toggle`)
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(toggleResponse.body.data.completed).toBe(true);

            // Step 7: Get statistics
            const statsResponse = await request(app)
                .get('/api/todos/stats/summary')
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(statsResponse.body.data.total).toBe(3);
            expect(statsResponse.body.data.completed).toBe(2);
            expect(statsResponse.body.data.pending).toBe(1);

            // Step 8: Filter todos
            const filterResponse = await request(app)
                .get('/api/todos?completed=true')
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(filterResponse.body.data.length).toBe(2);

            // Step 9: Delete a todo
            const todoToDelete = createdTodos[2];
            await request(app)
                .delete(`/api/todos/${todoToDelete._id}`)
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            // Step 10: Verify deletion
            const finalStatsResponse = await request(app)
                .get('/api/todos/stats/summary')
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(finalStatsResponse.body.data.total).toBe(2);

            // Step 11: Refresh token (use the refresh token from login, not registration)
            const refreshResponse = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: newRefreshToken })
                .expect(200);

            expect(refreshResponse.body.data.accessToken).toBeDefined();
            expect(refreshResponse.body.data.refreshToken).toBeDefined();

            // Step 12: Logout
            const logoutResponse = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${newAccessToken}`)
                .expect(200);

            expect(logoutResponse.body.success).toBe(true);
        });
    });

    describe('Error Handling Workflow', () => {
        it('should handle various error scenarios gracefully', async () => {
            // Test invalid registration
            const invalidUserData = {
                username: 'a', // Too short
                email: 'invalid-email',
                password: '123' // Too short
            };

            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send(invalidUserData)
                .expect(400);

            expect(registerResponse.body.success).toBe(false);
            expect(registerResponse.body.errors).toBeDefined();

            // Test invalid login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(loginResponse.body.success).toBe(false);

            // Test accessing protected route without token
            const todosResponse = await request(app)
                .get('/api/todos')
                .expect(401);

            expect(todosResponse.body.success).toBe(false);
        });
    });

    describe('Data Isolation', () => {
        it('should maintain data isolation between users', async () => {
            // Create two users with unique usernames and emails
            const user1 = await global.testUtils.createTestUser(app, { email: 'user1@example.com', username: 'user1' });
            const user2 = await global.testUtils.createTestUser(app, { email: 'user2@example.com', username: 'user2' });

            // User 1 creates a todo
            const todo1 = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${user1.accessToken}`)
                .send(global.testUtils.generateTestTodo({ title: 'User 1 Todo' }))
                .expect(201);

            // User 2 creates a todo
            const todo2 = await request(app)
                .post('/api/todos')
                .set('Authorization', `Bearer ${user2.accessToken}`)
                .send(global.testUtils.generateTestTodo({ title: 'User 2 Todo' }))
                .expect(201);

            // User 1 should only see their own todos
            const user1Todos = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${user1.accessToken}`)
                .expect(200);

            expect(user1Todos.body.data.length).toBe(1);
            expect(user1Todos.body.data[0].title).toBe('User 1 Todo');

            // User 2 should only see their own todos
            const user2Todos = await request(app)
                .get('/api/todos')
                .set('Authorization', `Bearer ${user2.accessToken}`)
                .expect(200);

            expect(user2Todos.body.data.length).toBe(1);
            expect(user2Todos.body.data[0].title).toBe('User 2 Todo');

            // User 1 should not be able to access User 2's todo
            await request(app)
                .get(`/api/todos/${todo2.body.data._id}`)
                .set('Authorization', `Bearer ${user1.accessToken}`)
                .expect(404);
        });
    });
}); 