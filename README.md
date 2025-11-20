# EMI Calculator Backend

A comprehensive backend API for EMI Calculator application with admin panel for managing loan categories and loans.

## Features

- **Admin Authentication**: Signup and login with JWT tokens
- **Category Management**: CRUD operations for loan categories (Home Loan, Personal Loan, etc.)
- **Loan Management**: CRUD operations for loans under each category
- **Public APIs**: Public endpoints to fetch categories and loans
- **MongoDB Integration**: MongoDB database for data storage
- **Express.js**: Fast and robust Node.js framework

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- bcryptjs (Password hashing)
- express-validator (Input validation)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emi-calculator
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Admin Signup
- **POST** `/api/auth/signup`
- **Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Admin Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Get Current Admin
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Admin - Categories (Protected)

#### Create Category
- **POST** `/api/admin/categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Home Loan",
  "description": "Home loan category"
}
```

#### Get All Categories
- **GET** `/api/admin/categories`
- **Headers:** `Authorization: Bearer <token>`

#### Get Single Category
- **GET** `/api/admin/categories/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Category
- **PUT** `/api/admin/categories/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": true
}
```

#### Delete Category
- **DELETE** `/api/admin/categories/:id`
- **Headers:** `Authorization: Bearer <token>`

### Admin - Loans (Protected)

#### Create Loan
- **POST** `/api/admin/loans`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "category": "category_id_here",
  "loanTitle": "Home Loan - Best Rates",
  "loanCompany": "ABC Bank",
  "loanDescription": "Get the best home loan rates",
  "loanQuote": "Starting from 8.5%",
  "link": "https://example.com/apply"
}
```

#### Get All Loans
- **GET** `/api/admin/loans`
- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?category=category_id` (optional)

#### Get Single Loan
- **GET** `/api/admin/loans/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update Loan
- **PUT** `/api/admin/loans/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (all fields optional)
```json
{
  "loanTitle": "Updated Title",
  "loanCompany": "Updated Company",
  "loanDescription": "Updated description",
  "loanQuote": "Updated quote",
  "link": "https://updated-link.com",
  "isActive": true
}
```

#### Delete Loan
- **DELETE** `/api/admin/loans/:id`
- **Headers:** `Authorization: Bearer <token>`

### Public APIs

#### Get All Active Categories
- **GET** `/api/public/categories`

#### Get Single Category
- **GET** `/api/public/categories/:id`

#### Get All Active Loans
- **GET** `/api/public/loans`
- **Query:** `?category=category_id` (optional)

#### Get Loans by Category
- **GET** `/api/public/loans/category/:categoryId`

#### Get Single Loan
- **GET** `/api/public/loans/:id`

### Health Check
- **GET** `/api/health`

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Models

### Admin
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required, hashed)

### Category
- `name` (String, required, unique)
- `description` (String, optional)
- `isActive` (Boolean, default: true)

### Loan
- `category` (ObjectId, ref: Category, required)
- `loanTitle` (String, required)
- `loanCompany` (String, required)
- `loanDescription` (String, required)
- `loanQuote` (String, required)
- `link` (String, required, URL)
- `isActive` (Boolean, default: true)

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes require valid JWT token
- Input validation using express-validator

## License

ISC

