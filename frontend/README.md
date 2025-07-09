# ToDo App Frontend

A modern React.js frontend for the ToDo application with JWT authentication, protected routes, and a beautiful UI built with Tailwind CSS.

## Features

- 🔐 JWT-based authentication with automatic token refresh
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

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoginForm.js     # User login form
│   ├── RegisterForm.js  # User registration form
│   ├── Navbar.js        # Navigation bar
│   ├── ProtectedRoute.js # Route protection component
│   ├── TodoList.js      # Main todo list component
│   ├── TodoItem.js      # Individual todo item
│   └── TodoForm.js      # Todo creation/editing form
├── context/             # React context providers
│   └── AuthContext.js   # Authentication context
├── pages/               # Page components
│   └── Dashboard.js     # Main dashboard page
├── App.js               # Main app component with routing
├── index.js             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## Key Components

### Authentication
- **AuthContext**: Manages user authentication state, tokens, and API calls
- **LoginForm**: User login with email and password
- **RegisterForm**: User registration with validation
- **ProtectedRoute**: Wraps routes that require authentication

### Todo Management
- **TodoList**: Main component for displaying and managing todos
- **TodoItem**: Individual todo display with actions
- **TodoForm**: Modal form for creating and editing todos

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Spinners and skeleton loaders
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback
- **Smooth Animations**: CSS transitions and hover effects

## API Integration

The frontend communicates with the backend API through:

- **Axios**: HTTP client with interceptors for authentication
- **Automatic Token Refresh**: Handles expired tokens seamlessly
- **Error Handling**: Consistent error messages across the app
- **Optimistic Updates**: Immediate UI updates with rollback on errors

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable button, input, and card styles
- **Color Scheme**: Consistent color palette with semantic naming
- **Responsive Breakpoints**: Mobile-first responsive design

## State Management

- **React Context**: For global authentication state
- **Local State**: Component-level state management
- **useEffect**: For side effects and API calls
- **useState**: For local component state

## Security Features

- **JWT Token Storage**: Secure token management in localStorage
- **Automatic Logout**: Session expiration handling
- **Protected Routes**: Unauthorized access prevention
- **Input Validation**: Client-side form validation
- **XSS Prevention**: Safe rendering of user content

## Performance Optimizations

- **Code Splitting**: Automatic code splitting with React Router
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Optimized search input
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Environment Variables
The frontend uses a proxy configuration to communicate with the backend:
- Development: `http://localhost:5000` (configured in package.json)
- Production: Update the proxy or use environment variables

### Code Style
- ESLint configuration included
- Prettier formatting recommended
- Component naming: PascalCase
- File naming: PascalCase for components, camelCase for utilities

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

### Environment Configuration
For production deployment, update the API endpoint in your hosting service's environment variables or build configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT 