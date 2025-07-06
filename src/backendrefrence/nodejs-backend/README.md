
# Project Management Backend - Node.js + MySQL

This is a Node.js backend for the Project Management System using MySQL database.

## Features

- **Authentication**: JWT-based authentication with HOTS login integration
- **Projects Management**: CRUD operations for projects
- **Tasks Management**: Task creation, assignment, and status updates
- **User Management**: User and department management
- **Session Management**: Token-based session handling with database storage

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

## Installation

1. **Clone and setup**:
   ```bash
   cd src/backendrefrence/nodejs-backend
   npm install
   ```

2. **Database Setup**:
   - Create a MySQL database named `project_management`
   - Import your existing MySQL schema
   - Make sure you have the following tables:
     - `hots_users` (for authentication)
     - `pm_projects` (for projects)
     - `pm_tasks` (for tasks)
     - `pm_users` (for project management users)
     - `pm_departments` (for departments)
     - `user_sessions` (for session management)

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=project_management
   JWT_SECRET=your-super-secret-jwt-key
   PORT=8888
   ```

4. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - Login with uid, password, and asin
- `POST /auth/keep-login` - Refresh/validate session
- `POST /auth/logout` - Logout and invalidate session

### Projects
- `GET /projects` - Get all projects (with filtering)
- `GET /projects/:id` - Get project detail with tasks
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks (with filtering)
- `GET /tasks/my-tasks` - Get current user's tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id/status` - Update task status

### Users
- `GET /users` - Get all users
- `GET /users/departments` - Get all departments

## Database Schema Requirements

### Required Tables

```sql
-- Session management table
CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Your existing tables should include:
-- hots_users (for authentication)
-- pm_projects, pm_tasks, pm_users, pm_departments
```

## HOTS Authentication Integration

The backend is designed to work with your existing HOTS authentication system. You'll need to:

1. **Modify the authentication query** in `routes/auth.js` to match your HOTS table structure
2. **Update password verification** logic based on your HOTS system
3. **Adjust user data mapping** to match your user schema

Example modification in `routes/auth.js`:
```javascript
// Replace this query with your HOTS authentication logic
const [hotsUsers] = await pool.execute(
  'SELECT * FROM your_hots_table WHERE uid = ? AND is_active = 1',
  [uid]
);
```

## Security Features

- JWT token authentication
- Database session storage
- CORS protection
- SQL injection prevention with prepared statements
- Token expiration handling

## Development

- **Hot reload**: Use `npm run dev` for development with auto-restart
- **Logging**: Console logs for debugging and monitoring
- **Error handling**: Comprehensive error handling with proper HTTP status codes

## Deployment

1. Set environment variables in production
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "pm-backend"
   ```
3. Configure reverse proxy (nginx) if needed
4. Set up SSL certificates for HTTPS

## Testing

Test the API endpoints:
```bash
# Health check
curl http://localhost:8888/health

# Login test
curl -X POST http://localhost:8888/auth/login \
  -H "Content-Type: application/json" \
  -d '{"uid":"test_user","password":"test_pass","asin":"test_pass"}'
```

## Notes

- The backend uses `tokek` instead of `token` to match your frontend expectations
- Authentication middleware checks both JWT validity and database session
- All routes (except auth) require authentication
- MySQL connection pooling is configured for better performance
