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

### Detail documentation

# API Documentation

## Authentication Endpoints

### Register a new user

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `409 Conflict` - User already exists
- `400 Bad Request` - Invalid input data

---

### Login a user

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials

---

### Get current user profile

```
GET /api/auth/profile
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - No token provided or invalid token
- `404 Not Found` - User not found

---

## File Management Endpoints

### Upload a file

```
POST /api/files/upload
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**

- `file` - The file to upload (required)

**Response (201 Created):**

```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "60d21b4667d0d8992e610c85",
    "filename": "1677853461234-a1b2c3d4.jpg",
    "originalname": "profile.jpg",
    "contentType": "image/jpeg",
    "size": 1024000,
    "uploadDate": "2023-12-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - No file uploaded or invalid file
- `401 Unauthorized` - No token provided or invalid token
- `413 Payload Too Large` - File exceeds size limit (5MB)

---

### Get all files for authenticated user

```
GET /api/files
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters (Optional):**

- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10)
- `sort` - Sort field (default: uploadDate)
- `order` - Sort order, 'asc' or 'desc' (default: desc)

**Response (200 OK):**

```json
{
  "files": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "filename": "1677853461234-a1b2c3d4.jpg",
      "originalname": "profile.jpg",
      "contentType": "image/jpeg",
      "size": 1024000,
      "uploadDate": "2023-12-01T12:00:00.000Z"
    },
    {
      "id": "60d21b4667d0d8992e610c86",
      "filename": "1677853498765-e5f6g7h8.jpg",
      "originalname": "background.jpg",
      "contentType": "image/jpeg",
      "size": 2048000,
      "uploadDate": "2023-12-02T14:30:00.000Z"
    }
  ],
  "pagination": {
    "totalFiles": 15,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10
  }
}
```

**Error Responses:**

- `401 Unauthorized` - No token provided or invalid token

---

### Get a specific file by ID

```
GET /api/files/:id
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**

- `id` - File ID (required)

**Response:**

- The file content with appropriate Content-Type header
- Headers: Content-Type, Content-Disposition

**Error Responses:**

- `401 Unauthorized` - No token provided or invalid token
- `404 Not Found` - File not found or user doesn't have access

---

### Delete a file by ID

```
DELETE /api/files/:id
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters:**

- `id` - File ID (required)

**Response (200 OK):**

```json
{
  "message": "File deleted successfully"
}
```

**Error Responses:**

- `401 Unauthorized` - No token provided or invalid token
- `404 Not Found` - File not found or user doesn't have access

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error: username is required"
}
```

### 401 Unauthorized

```json
{
  "message": "Not authorized, no token provided"
}
```

or

```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden

```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "message": "Something went wrong on the server"
}
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens are obtained from the login or register endpoints and are valid for 24 hours.

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
