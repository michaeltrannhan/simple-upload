# File Upload Backend

This Express.js backend provides a secure API for file uploads using MongoDB's GridFS with JWT authentication.

## Features

- User authentication with JWT
- File upload using GridFS for efficient storage of large files
- File management (upload, view, delete)
- Security best practices (OWASP compliant)
- Error handling

## Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd file-upload-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

- Set a strong JWT_SECRET
- Configure your MongoDB connection string
- Adjust other settings as needed

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile (requires authentication)

### File Management

- `POST /api/files/upload` - Upload a file (requires authentication)
- `GET /api/files` - Get all files for the authenticated user
- `GET /api/files/:id` - Get a specific file by ID
- `DELETE /api/files/:id` - Delete a file by ID

## Security Features

- Password hashing using bcrypt
- JWT with expiration for authentication
- Input validation
- CORS configuration
- Helmet for securing HTTP headers
- File type validation
- File size limits
- Error handling with proper status codes
- Role-based access control

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

## Environment Variables

| Variable       | Description               | Default               |
| -------------- | ------------------------- | --------------------- |
| PORT           | Server port               | 5000                  |
| NODE_ENV       | Environment               | development           |
| MONGODB_URI    | MongoDB connection string | -                     |
| JWT_SECRET     | Secret for JWT signing    | -                     |
| JWT_EXPIRES_IN | JWT expiration time       | 1d                    |
| FRONTEND_URL   | Frontend URL for CORS     | http://localhost:3000 |
