const request = require('supertest');
const app = require('../server');

describe('Server Endpoints', () => {
    describe('GET /api/health', () => {
        it('should return health check status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body.status).toBe('OK');
            expect(response.body.message).toBe('Server is running');
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app)
                .get('/api/non-existent-route')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Route not found');
        });
    });

    describe('CORS', () => {
        it('should handle CORS preflight requests', async () => {
            const response = await request(app)
                .options('/api/auth/login')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'POST')
                .set('Access-Control-Request-Headers', 'Content-Type')
                .expect(204);

            expect(response.headers['access-control-allow-origin']).toBeDefined();
        });
    });

    describe('Rate Limiting', () => {
        it('should limit requests', async () => {
            // Make multiple requests quickly
            const promises = [];
            for (let i = 0; i < 105; i++) {
                promises.push(
                    request(app)
                        .get('/api/health')
                        .catch(err => err.response)
                );
            }

            const responses = await Promise.all(promises);
            const rateLimited = responses.filter(res => res.status === 429);

            // Should have some rate limited responses
            expect(rateLimited.length).toBeGreaterThan(0);
        });
    });
}); 