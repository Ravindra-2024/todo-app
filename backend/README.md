# ToDo App Backend

A Node.js/Express.js backend API for a ToDo application with JWT authentication and refresh tokens.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👤 User registration and login
- 📝 CRUD operations for todos
- 🎯 Priority levels and due dates
- 📊 Todo statistics and filtering
- 🔒 Protected routes with middleware
- ✅ Input validation and error handling
- 🛡️ Security features (helmet, rate limiting, CORS)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout User
```
POST /api/auth/logout
Authorization: Bearer your-access-token
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer your-access-token
```

### Todos

#### Get All Todos
```
GET /api/todos
Authorization: Bearer your-access-token

Query Parameters:
- completed: boolean (filter by completion status)
- priority: string (low|medium|high)
- sortBy: string (createdAt|updatedAt|dueDate|priority)
- sortOrder: string (asc|desc)
```

#### Get Single Todo
```
GET /api/todos/:id
Authorization: Bearer your-access-token
```

#### Create Todo
```
POST /api/todos
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app project",
  "priority": "high",
  "dueDate": "2024-01-15T10:00:00.000Z"
}
```

#### Update Todo
```
PUT /api/todos/:id
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Todo
```
DELETE /api/todos/:id
Authorization: Bearer your-access-token
```

#### Toggle Todo Completion
```
PATCH /api/todos/:id/toggle
Authorization: Bearer your-access-token
```

#### Get Todo Statistics
```
GET /api/todos/stats/summary
Authorization: Bearer your-access-token
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Automatic token refresh mechanism
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Express-validator for request validation
- **Rate Limiting**: Prevents abuse with request limiting
- **Helmet**: Security headers for protection
- **CORS**: Configured for frontend communication

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/todo-app |
| `JWT_SECRET` | Secret for JWT access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiration | 15m |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `NODE_ENV` | Environment mode | development |

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication failures
- Database errors
- JWT token issues
- Rate limiting
- General server errors

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

## Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## License

MIT 