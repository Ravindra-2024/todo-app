# ToDo App - Full Stack Application

A complete ToDo application built with Node.js/Express.js backend and React.js frontend, featuring JWT authentication, protected routes, and a modern UI.

## 🚀 Features

### Backend (Node.js/Express.js)
- 🔐 JWT-based authentication with refresh tokens
- 👤 User registration and login
- 📝 Full CRUD operations for todos
- 🎯 Priority levels and due dates
- 📊 Todo statistics and filtering
- 🔒 Protected routes with middleware
- ✅ Input validation and error handling
- 🛡️ Security features (helmet, rate limiting, CORS)
- 🗄️ MongoDB database with Mongoose ODM

### Frontend (React.js 18)
- 🔐 JWT authentication with automatic token refresh
- 🛡️ Protected routes with automatic redirects
- 📱 Responsive design with mobile-first approach
- 🎨 Modern UI with Tailwind CSS
- 📝 Full CRUD operations for todos
- 🔍 Search and filtering capabilities
- 📊 Real-time statistics dashboard
- ⚡ Optimistic updates and smooth animations
- 🔔 Toast notifications for user feedback
- 📅 Due date management with overdue indicators
- 🏷️ Priority levels with visual indicators

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-app
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp config.env.example config.env
# Edit config.env with your settings

# Start MongoDB (if running locally)
# Make sure MongoDB is running on your system

# Start the development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## ⚙️ Configuration

### Backend Environment Variables
Create a `config.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend Configuration
The frontend is configured to proxy requests to the backend at `http://localhost:5000` during development.

## 📁 Project Structure

```
todo-app/
├── backend/                 # Node.js/Express.js backend
│   ├── models/             # Mongoose models
│   │   ├── User.js         # User model
│   │   └── Todo.js         # Todo model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── todos.js        # Todo routes
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── frontend/               # React.js frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos (with filters)
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `GET /api/todos/stats/summary` - Get todo statistics

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Todos**: Add new todos with title, description, priority, and due date
3. **Manage Todos**: Edit, delete, or mark todos as complete
4. **Filter & Search**: Use the search bar and filters to find specific todos
5. **View Statistics**: See your todo completion statistics on the dashboard

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side and client-side validation
- **Rate Limiting**: Prevents abuse with request limiting
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet**: Security headers for protection
- **Protected Routes**: Frontend and backend route protection

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Deploy to platforms like:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation in the `backend/README.md` and `frontend/README.md` files
2. Review the API endpoints and their expected request/response formats
3. Ensure MongoDB is running and accessible
4. Verify all environment variables are properly set

## 🔄 Updates

Stay updated with the latest changes by:
- Watching the repository
- Checking the release notes
- Following the development roadmap

---

**Happy Coding! 🎉** 