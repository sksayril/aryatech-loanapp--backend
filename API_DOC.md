# API Documentation

## Base URL
```
http://localhost:5000/api
https://7cvccltb-5000.inc1.devtunnels.ms/api
```

## Authentication

Most admin endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Admin - Categories APIs](#admin---categories-apis)
3. [Admin - Loans APIs](#admin---loans-apis)
4. [Admin - Commodity Prices APIs](#admin---commodity-prices-apis)
5. [Admin - Apply Now APIs](#admin---apply-now-apis)
6. [Public - Categories APIs](#public---categories-apis)
7. [Public - Loans APIs](#public---loans-apis)
8. [Public - Commodity Prices APIs](#public---commodity-prices-apis)
9. [Public - Apply Now APIs](#public---apply-now-apis)
10. [Health Check](#health-check)
11. [Error Responses](#error-responses)

---

## Authentication APIs

### 1. Admin Signup

Create a new admin account.

**Endpoint:** `POST /api/auth/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Username must be at least 3 characters",
      "param": "username",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "message": "Admin with this email or username already exists"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Server error during signup",
  "error": "Error message details"
}
```

---

### 2. Admin Login

Login with existing admin credentials.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Server error during login",
  "error": "Error message details"
}
```

---

### 3. Get Current Admin

Get the currently authenticated admin's information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "admin": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

**Error Response (401 Unauthorized - Invalid Token):**
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

---

## Admin - Categories APIs

All endpoints in this section require authentication.

### 1. Create Category

Create a new loan category.

**Endpoint:** `POST /api/admin/categories`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Home Loan",
  "description": "Home loan category for property purchases"
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Home Loan",
    "description": "Home loan category for property purchases",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Category name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "message": "Category with this name already exists"
}
```

---

### 2. Get All Categories

Get all categories (admin view - includes inactive).

**Endpoint:** `GET /api/admin/categories`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "categories": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Personal Loan",
      "description": "Personal loan category for various needs",
      "isActive": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Category

Get a single category by ID.

**Endpoint:** `GET /api/admin/categories/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Category ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Home Loan",
    "description": "Home loan category for property purchases",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 4. Update Category

Update an existing category.

**Endpoint:** `PUT /api/admin/categories/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Category ID

**Request Body:** (All fields are optional)
```json
{
  "name": "Updated Home Loan",
  "description": "Updated description",
  "isActive": true
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Updated Home Loan",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Category name cannot be empty",
      "param": "name",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "message": "Category with this name already exists"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 5. Delete Category

Delete a category.

**Endpoint:** `DELETE /api/admin/categories/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Category ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## Admin - Loans APIs

All endpoints in this section require authentication.

### 1. Create Loan

Create a new loan under a category with bank name and logo.

**Endpoint:** `POST /api/admin/loans`

**Authentication:** Required

**Request Format:** `multipart/form-data`

**Request Fields:**
- `category` (string, required) - Category ID
- `loanTitle` (string, required) - Loan title
- `loanCompany` (string, required) - Loan company name
- `bankName` (string, required) - Bank name
- `bankLogo` (file, optional) - Bank logo image (jpeg, jpg, png, gif, webp, max 5MB)
- `loanDescription` (string, required) - Loan description
- `loanQuote` (string, required) - Loan quote
- `link` (string, required) - Valid URL

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/loans \
  -H "Authorization: Bearer <token>" \
  -F "category=64a1b2c3d4e5f6g7h8i9j0k1" \
  -F "loanTitle=Home Loan - Best Rates" \
  -F "loanCompany=ABC Bank" \
  -F "bankName=ABC Bank" \
  -F "bankLogo=@/path/to/logo.png" \
  -F "loanDescription=Get the best home loan rates with flexible repayment options." \
  -F "loanQuote=Starting from 8.5% interest rate" \
  -F "link=https://example.com/apply-home-loan"
```

**Example using JavaScript FormData:**
```javascript
const formData = new FormData();
formData.append('category', '64a1b2c3d4e5f6g7h8i9j0k1');
formData.append('loanTitle', 'Home Loan - Best Rates');
formData.append('loanCompany', 'ABC Bank');
formData.append('bankName', 'ABC Bank');
formData.append('bankLogo', fileInput.files[0]); // File from input
formData.append('loanDescription', 'Get the best home loan rates...');
formData.append('loanQuote', 'Starting from 8.5% interest rate');
formData.append('link', 'https://example.com/apply-home-loan');

fetch('/api/admin/loans', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>'
  },
  body: formData
});
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Loan created successfully",
  "loan": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "category": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases"
    },
    "loanTitle": "Home Loan - Best Rates",
    "loanCompany": "ABC Bank",
    "bankName": "ABC Bank",
    "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/abc123def456.png",
    "loanDescription": "Get the best home loan rates with flexible repayment options. Perfect for first-time homebuyers.",
    "loanQuote": "Starting from 8.5% interest rate",
    "link": "https://example.com/apply-home-loan",
    "isActive": true,
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Loan title is required",
      "param": "loanTitle",
      "location": "body"
    },
    {
      "msg": "Bank name is required",
      "param": "bankName",
      "location": "body"
    },
    {
      "msg": "Link must be a valid URL",
      "param": "link",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Invalid File):**
```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

**Error Response (500 Internal Server Error - Upload Failed):**
```json
{
  "success": false,
  "message": "Failed to upload bank logo",
  "error": "Error details"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 2. Get All Loans

Get all loans (admin view - includes inactive).

**Endpoint:** `GET /api/admin/loans`

**Authentication:** Required

**Query Parameters:**
- `category` (string, optional) - Filter by category ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /api/admin/loans?category=64a1b2c3d4e5f6g7h8i9j0k1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "loans": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "category": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Home Loan",
        "description": "Home loan category for property purchases"
      },
      "loanTitle": "Home Loan - Best Rates",
      "loanCompany": "ABC Bank",
      "bankName": "ABC Bank",
      "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/abc123def456.png",
      "loanDescription": "Get the best home loan rates with flexible repayment options.",
      "loanQuote": "Starting from 8.5% interest rate",
      "link": "https://example.com/apply-home-loan",
      "isActive": true,
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
      "category": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Personal Loan",
        "description": "Personal loan category for various needs"
      },
      "loanTitle": "Personal Loan - Quick Approval",
      "loanCompany": "XYZ Finance",
      "bankName": "XYZ Finance",
      "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/xyz789ghi012.png",
      "loanDescription": "Quick personal loans with instant approval.",
      "loanQuote": "Interest rates from 10%",
      "link": "https://example.com/apply-personal-loan",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00.000Z",
      "updatedAt": "2024-01-15T14:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Loan

Get a single loan by ID.

**Endpoint:** `GET /api/admin/loans/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Loan ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "loan": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "category": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases"
    },
    "loanTitle": "Home Loan - Best Rates",
    "loanCompany": "ABC Bank",
    "bankName": "ABC Bank",
    "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/abc123def456.png",
    "loanDescription": "Get the best home loan rates with flexible repayment options.",
    "loanQuote": "Starting from 8.5% interest rate",
    "link": "https://example.com/apply-home-loan",
    "isActive": true,
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Loan not found"
}
```

---

### 4. Update Loan

Update an existing loan. You can update the bank logo by uploading a new file.

**Endpoint:** `PUT /api/admin/loans/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Loan ID

**Request Format:** `multipart/form-data`

**Request Fields:** (All fields are optional)
- `category` (string) - Category ID
- `loanTitle` (string) - Loan title
- `loanCompany` (string) - Loan company name
- `bankName` (string) - Bank name
- `bankLogo` (file) - Bank logo image (jpeg, jpg, png, gif, webp, max 5MB). If provided, old logo will be deleted from S3.
- `loanDescription` (string) - Loan description
- `loanQuote` (string) - Loan quote
- `link` (string) - Valid URL
- `isActive` (boolean) - Active status

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Example using cURL:**
```bash
curl -X PUT http://localhost:5000/api/admin/loans/64a1b2c3d4e5f6g7h8i9j0k3 \
  -H "Authorization: Bearer <token>" \
  -F "loanTitle=Updated Home Loan Title" \
  -F "bankName=Updated Bank Name" \
  -F "bankLogo=@/path/to/new-logo.png"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Loan updated successfully",
  "loan": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "category": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases"
    },
    "loanTitle": "Updated Home Loan Title",
    "loanCompany": "Updated Bank Name",
    "bankName": "Updated Bank Name",
    "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/new123def456.png",
    "loanDescription": "Updated description",
    "loanQuote": "Updated quote - Starting from 8.0%",
    "link": "https://updated-link.com",
    "isActive": true,
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T15:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Link must be a valid URL",
      "param": "link",
      "location": "body"
    }
  ]
}
```

**Error Response (404 Not Found - Category):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**Error Response (404 Not Found - Loan):**
```json
{
  "success": false,
  "message": "Loan not found"
}
```

---

### 5. Delete Loan

Delete a loan.

**Endpoint:** `DELETE /api/admin/loans/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Loan ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Loan deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Loan not found"
}
```

---

## Admin - Commodity Prices APIs

All endpoints in this section require authentication.

### 1. Create Commodity Price

Create a new commodity price entry for Silver, INR, Petrol, Diesel, or LP Gas with state and city.

**Endpoint:** `POST /api/admin/commodity-prices`

**Authentication:** Required

**Request Body:**
```json
{
  "commodityType": "Petrol",
  "state": "Maharashtra",
  "city": "Mumbai",
  "price": 105.50,
  "unit": "per liter",
  "isActive": true
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Valid Commodity Types:**
- `Silver`
- `INR`
- `Petrol`
- `Diesel`
- `LP Gas`

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Commodity price created successfully",
  "commodityPrice": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "commodityType": "Petrol",
    "state": "Maharashtra",
    "city": "Mumbai",
    "price": 105.50,
    "unit": "per liter",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Commodity type must be one of: Silver, INR, Petrol, Diesel, LP Gas",
      "param": "commodityType",
      "location": "body"
    },
    {
      "msg": "State is required",
      "param": "state",
      "location": "body"
    },
    {
      "msg": "Price must be a positive number",
      "param": "price",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "message": "Commodity price for this type, state, and city combination already exists"
}
```

---

### 2. Get All Commodity Prices

Get all commodity prices (admin view - includes inactive).

**Endpoint:** `GET /api/admin/commodity-prices`

**Authentication:** Required

**Query Parameters:**
- `commodityType` (string, optional) - Filter by commodity type (Silver, INR, Petrol, Diesel, LP Gas)
- `state` (string, optional) - Filter by state (case-insensitive partial match)
- `city` (string, optional) - Filter by city (case-insensitive partial match)
- `isActive` (boolean, optional) - Filter by active status

**Request Headers:**
```
Authorization: Bearer <token>
```

**Example Requests:**
```
GET /api/admin/commodity-prices
GET /api/admin/commodity-prices?commodityType=Petrol
GET /api/admin/commodity-prices?commodityType=Petrol&state=Maharashtra
GET /api/admin/commodity-prices?commodityType=Petrol&state=Maharashtra&city=Mumbai
GET /api/admin/commodity-prices?isActive=true
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "commodityPrices": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
      "commodityType": "Petrol",
      "state": "Maharashtra",
      "city": "Mumbai",
      "price": 105.50,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T16:00:00.000Z",
      "updatedAt": "2024-01-15T16:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
      "commodityType": "Diesel",
      "state": "Maharashtra",
      "city": "Mumbai",
      "price": 94.20,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T16:30:00.000Z",
      "updatedAt": "2024-01-15T16:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Single Commodity Price

Get a single commodity price by ID.

**Endpoint:** `GET /api/admin/commodity-prices/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Commodity Price ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "commodityPrice": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "commodityType": "Petrol",
    "state": "Maharashtra",
    "city": "Mumbai",
    "price": 105.50,
    "unit": "per liter",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Commodity price not found"
}
```

---

### 4. Update Commodity Price

Update an existing commodity price.

**Endpoint:** `PUT /api/admin/commodity-prices/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Commodity Price ID

**Request Body:** (All fields are optional)
```json
{
  "commodityType": "Petrol",
  "state": "Maharashtra",
  "city": "Pune",
  "price": 106.00,
  "unit": "per liter",
  "isActive": true
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Commodity price updated successfully",
  "commodityPrice": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "commodityType": "Petrol",
    "state": "Maharashtra",
    "city": "Pune",
    "price": 106.00,
    "unit": "per liter",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T17:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Price must be a positive number",
      "param": "price",
      "location": "body"
    }
  ]
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "message": "Commodity price for this type, state, and city combination already exists"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Commodity price not found"
}
```

---

### 5. Delete Commodity Price

Delete a commodity price.

**Endpoint:** `DELETE /api/admin/commodity-prices/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string, required) - Commodity Price ID

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Commodity price deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Commodity price not found"
}
```

---

## Admin - Apply Now APIs

All endpoints in this section require authentication.

### 1. Create or Update Apply Now Settings

Create or update the Apply Now button settings (active/inactive status).

**Endpoint:** `POST /api/admin/apply-now`

**Authentication:** Required

**Request Body:**
```json
{
  "isActive": true,
  "description": "Apply Now button is currently active"
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Fields:**
- `isActive` (boolean, required) - Whether the Apply Now button is active (true) or inactive (false)
- `description` (string, optional) - Optional description for the Apply Now settings

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Apply Now settings updated successfully",
  "applyNow": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k12",
    "isActive": true,
    "description": "Apply Now button is currently active",
    "createdAt": "2024-01-15T18:00:00.000Z",
    "updatedAt": "2024-01-15T18:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "isActive must be a boolean value",
      "param": "isActive",
      "location": "body"
    }
  ]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

---

### 2. Get Apply Now Settings

Get the current Apply Now button settings.

**Endpoint:** `GET /api/admin/apply-now`

**Authentication:** Required

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "applyNow": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k12",
    "isActive": true,
    "description": "Apply Now button is currently active",
    "createdAt": "2024-01-15T18:00:00.000Z",
    "updatedAt": "2024-01-15T18:00:00.000Z"
  }
}
```

**Note:** If no settings exist, a default settings document will be created automatically with `isActive: true`.

---

### 3. Update Apply Now Settings

Update the Apply Now button settings (partial update supported).

**Endpoint:** `PUT /api/admin/apply-now`

**Authentication:** Required

**Request Body:** (All fields are optional)
```json
{
  "isActive": false,
  "description": "Apply Now button is currently inactive"
}
```

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Apply Now settings updated successfully",
  "applyNow": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k12",
    "isActive": false,
    "description": "Apply Now button is currently inactive",
    "createdAt": "2024-01-15T18:00:00.000Z",
    "updatedAt": "2024-01-15T19:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "isActive must be a boolean value",
      "param": "isActive",
      "location": "body"
    }
  ]
}
```

---

## Public - Categories APIs

These endpoints do not require authentication and only return active categories.

### 1. Get All Active Categories

Get all active categories (public view) with loan counts.

**Endpoint:** `GET /api/public/categories`

**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "categories": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases",
      "isActive": true,
      "loanCount": 5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Personal Loan",
      "description": "Personal loan category for various needs",
      "isActive": true,
      "loanCount": 3,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Response Fields:**
- `count`: Total number of active categories
- `categories`: Array of category objects, each containing:
  - `_id`: Category ID
  - `name`: Category name
  - `description`: Category description
  - `isActive`: Active status (always true for public API)
  - `loanCount`: Number of active loans in this category
  - `createdAt`: Creation timestamp
  - `updatedAt`: Last update timestamp

---

### 2. Get Single Category

Get a single active category by ID with loan count.

**Endpoint:** `GET /api/public/categories/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` (string, required) - Category ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Home Loan",
    "description": "Home loan category for property purchases",
    "isActive": true,
    "loanCount": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response Fields:**
- `category`: Category object containing:
  - `_id`: Category ID
  - `name`: Category name
  - `description`: Category description
  - `isActive`: Active status (always true for public API)
  - `loanCount`: Number of active loans in this category
  - `createdAt`: Creation timestamp
  - `updatedAt`: Last update timestamp

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## Public - Loans APIs

These endpoints do not require authentication and only return active loans.

### 1. Get All Active Loans

Get all active loans (public view).

**Endpoint:** `GET /api/public/loans`

**Authentication:** Not required

**Query Parameters:**
- `category` (string, optional) - Filter by category ID

**Example Request:**
```
GET /api/public/loans?category=64a1b2c3d4e5f6g7h8i9j0k1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "loans": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "category": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Home Loan",
        "description": "Home loan category for property purchases"
      },
      "loanTitle": "Home Loan - Best Rates",
      "loanCompany": "ABC Bank",
      "loanDescription": "Get the best home loan rates with flexible repayment options.",
      "loanQuote": "Starting from 8.5% interest rate",
      "link": "https://example.com/apply-home-loan",
      "isActive": true,
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
      "category": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Personal Loan",
        "description": "Personal loan category for various needs"
      },
      "loanTitle": "Personal Loan - Quick Approval",
      "loanCompany": "XYZ Finance",
      "loanDescription": "Quick personal loans with instant approval.",
      "loanQuote": "Interest rates from 10%",
      "link": "https://example.com/apply-personal-loan",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00.000Z",
      "updatedAt": "2024-01-15T14:00:00.000Z"
    }
  ]
}
```

**Error Response (404 Not Found - Invalid Category):**
```json
{
  "success": false,
  "message": "Category not found or inactive"
}
```

---

### 2. Get Loans by Category

Get all active loans for a specific category.

**Endpoint:** `GET /api/public/loans/category/:categoryId`

**Authentication:** Not required

**URL Parameters:**
- `categoryId` (string, required) - Category ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "category": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Home Loan",
    "description": "Home loan category for property purchases"
  },
  "loans": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "category": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "Home Loan",
        "description": "Home loan category for property purchases"
      },
      "loanTitle": "Home Loan - Best Rates",
      "loanCompany": "ABC Bank",
      "bankName": "ABC Bank",
      "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/abc123def456.png",
      "loanDescription": "Get the best home loan rates with flexible repayment options.",
      "loanQuote": "Starting from 8.5% interest rate",
      "link": "https://example.com/apply-home-loan",
      "isActive": true,
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found or inactive"
}
```

---

### 3. Get Single Loan

Get a single active loan by ID.

**Endpoint:** `GET /api/public/loans/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` (string, required) - Loan ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "loan": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "category": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Home Loan",
      "description": "Home loan category for property purchases"
    },
    "loanTitle": "Home Loan - Best Rates",
    "loanCompany": "ABC Bank",
    "bankName": "ABC Bank",
    "bankLogo": "https://notes-market-bucket.s3.eu-north-1.amazonaws.com/bank-logos/abc123def456.png",
    "loanDescription": "Get the best home loan rates with flexible repayment options.",
    "loanQuote": "Starting from 8.5% interest rate",
    "link": "https://example.com/apply-home-loan",
    "isActive": true,
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Loan not found"
}
```

---

## Public - Commodity Prices APIs

These endpoints do not require authentication and only return active commodity prices.

### 1. Get All Active Commodity Prices

Get all active commodity prices (public view).

**Endpoint:** `GET /api/public/commodity-prices`

**Authentication:** Not required

**Query Parameters:**
- `commodityType` (string, optional) - Filter by commodity type (Silver, INR, Petrol, Diesel, LP Gas)
- `state` (string, optional) - Filter by state (case-insensitive partial match)
- `city` (string, optional) - Filter by city (case-insensitive partial match)

**Example Requests:**
```
GET /api/public/commodity-prices
GET /api/public/commodity-prices?commodityType=Petrol
GET /api/public/commodity-prices?commodityType=Petrol&state=Maharashtra
GET /api/public/commodity-prices?commodityType=Petrol&state=Maharashtra&city=Mumbai
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "commodityPrices": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
      "commodityType": "Petrol",
      "state": "Maharashtra",
      "city": "Mumbai",
      "price": 105.50,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T16:00:00.000Z",
      "updatedAt": "2024-01-15T16:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
      "commodityType": "Diesel",
      "state": "Maharashtra",
      "city": "Mumbai",
      "price": 94.20,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T16:30:00.000Z",
      "updatedAt": "2024-01-15T16:30:00.000Z"
    }
  ]
}
```

---

### 2. Get All Commodity Prices Grouped by State and City

Get all active commodity prices organized by state and city. This endpoint returns all commodities (Petrol, Diesel, Silver, INR, LP Gas) grouped by location.

**Endpoint:** `GET /api/public/commodity-prices/grouped`

**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "statesCount": 2,
  "data": [
    {
      "state": "Maharashtra",
      "cities": [
        {
          "city": "Mumbai",
          "commodities": [
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
              "commodityType": "Petrol",
              "price": 105.50,
              "unit": "per liter",
              "createdAt": "2024-01-15T16:00:00.000Z",
              "updatedAt": "2024-01-15T16:00:00.000Z"
            },
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
              "commodityType": "Diesel",
              "price": 94.20,
              "unit": "per liter",
              "createdAt": "2024-01-15T16:30:00.000Z",
              "updatedAt": "2024-01-15T16:30:00.000Z"
            },
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k8",
              "commodityType": "LP Gas",
              "price": 950.00,
              "unit": "per cylinder",
              "createdAt": "2024-01-15T17:00:00.000Z",
              "updatedAt": "2024-01-15T17:00:00.000Z"
            }
          ]
        },
        {
          "city": "Pune",
          "commodities": [
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
              "commodityType": "Petrol",
              "price": 104.80,
              "unit": "per liter",
              "createdAt": "2024-01-15T17:00:00.000Z",
              "updatedAt": "2024-01-15T17:00:00.000Z"
            },
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k9",
              "commodityType": "Diesel",
              "price": 93.50,
              "unit": "per liter",
              "createdAt": "2024-01-15T17:30:00.000Z",
              "updatedAt": "2024-01-15T17:30:00.000Z"
            }
          ]
        }
      ]
    },
    {
      "state": "Gujarat",
      "cities": [
        {
          "city": "Ahmedabad",
          "commodities": [
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k10",
              "commodityType": "Petrol",
              "price": 103.50,
              "unit": "per liter",
              "createdAt": "2024-01-15T18:00:00.000Z",
              "updatedAt": "2024-01-15T18:00:00.000Z"
            },
            {
              "_id": "64a1b2c3d4e5f6g7h8i9j0k11",
              "commodityType": "Diesel",
              "price": 92.80,
              "unit": "per liter",
              "createdAt": "2024-01-15T18:30:00.000Z",
              "updatedAt": "2024-01-15T18:30:00.000Z"
            }
          ]
        }
      ]
    }
  ]
}
```

**Response Fields:**
- `count`: Total number of commodity price records
- `statesCount`: Total number of states
- `data`: Array of states, each containing:
  - `state`: State name
  - `cities`: Array of cities in that state, each containing:
    - `city`: City name
    - `commodities`: Array of all commodity prices for that city (Petrol, Diesel, Silver, INR, LP Gas)

---

### 3. Get Single Commodity Price

Get a single active commodity price by ID.

**Endpoint:** `GET /api/public/commodity-prices/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` (string, required) - Commodity Price ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "commodityPrice": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "commodityType": "Petrol",
    "state": "Maharashtra",
    "city": "Mumbai",
    "price": 105.50,
    "unit": "per liter",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Commodity price not found"
}
```

---

### 4. Get Commodity Prices by Type

Get all active commodity prices for a specific commodity type.

**Endpoint:** `GET /api/public/commodity-prices/type/:commodityType`

**Authentication:** Not required

**URL Parameters:**
- `commodityType` (string, required) - Commodity type (Silver, INR, Petrol, Diesel, LP Gas)

**Query Parameters:**
- `state` (string, optional) - Filter by state (case-insensitive partial match)
- `city` (string, optional) - Filter by city (case-insensitive partial match)

**Example Requests:**
```
GET /api/public/commodity-prices/type/Petrol
GET /api/public/commodity-prices/type/Petrol?state=Maharashtra
GET /api/public/commodity-prices/type/Petrol?state=Maharashtra&city=Mumbai
GET /api/public/commodity-prices/type/Silver
GET /api/public/commodity-prices/type/Diesel
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "commodityType": "Petrol",
  "commodityPrices": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
      "commodityType": "Petrol",
      "state": "Maharashtra",
      "city": "Mumbai",
      "price": 105.50,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T16:00:00.000Z",
      "updatedAt": "2024-01-15T16:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
      "commodityType": "Petrol",
      "state": "Maharashtra",
      "city": "Pune",
      "price": 104.80,
      "unit": "per liter",
      "isActive": true,
      "createdAt": "2024-01-15T17:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid commodity type. Must be one of: Silver, INR, Petrol, Diesel, LP Gas"
}
```

---

## Public - Apply Now APIs

These endpoints do not require authentication and return the current Apply Now button status.

### 1. Get Apply Now Status

Get the current status of the Apply Now button (active/inactive).

**Endpoint:** `GET /api/public/apply-now`

**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "success": true,
  "isActive": true,
  "description": "Apply Now button is currently active"
}
```

**Response Fields:**
- `success`: Boolean indicating request success
- `isActive`: Boolean indicating if the Apply Now button is active (true) or inactive (false)
- `description`: Optional description string (null if not set)

**Note:** If no settings exist, a default settings document will be created automatically with `isActive: true`.

**Example Response (Inactive):**
```json
{
  "success": true,
  "isActive": false,
  "description": "Apply Now button is currently inactive"
}
```

**Example Response (No Description):**
```json
{
  "success": true,
  "isActive": true,
  "description": null
}
```

---

## Health Check

### Get Server Status

Check if the server is running.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Success Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Error Responses

### Common Error Response Format

All error responses follow this general structure:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": [] // Optional: Array of validation errors
}
```

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required or invalid token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

### Common Error Scenarios

#### 1. Missing Authentication Token
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

#### 2. Invalid Authentication Token
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

#### 3. Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Field is required",
      "param": "fieldName",
      "location": "body"
    }
  ]
}
```

#### 4. Resource Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 5. Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details (only in development mode)"
}
```

---

## Data Models

### Admin Model
```json
{
  "_id": "ObjectId",
  "username": "string (unique, min 3 chars)",
  "email": "string (unique, valid email)",
  "password": "string (hashed, min 6 chars)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Category Model
```json
{
  "_id": "ObjectId",
  "name": "string (unique, required)",
  "description": "string (optional)",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Loan Model
```json
{
  "_id": "ObjectId",
  "category": "ObjectId (ref: Category, required)",
  "loanTitle": "string (required)",
  "loanCompany": "string (required)",
  "bankName": "string (required)",
  "bankLogo": "string (optional, S3 URL)",
  "loanDescription": "string (required)",
  "loanQuote": "string (required)",
  "link": "string (required, valid URL)",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Note:** 
- `bankLogo` is stored as a public S3 URL after upload
- Bank logos are uploaded to AWS S3 bucket in the `bank-logos` folder
- Supported image formats: jpeg, jpg, png, gif, webp
- Maximum file size: 5MB

### CommodityPrice Model
```json
{
  "_id": "ObjectId",
  "commodityType": "string (required, enum: ['Silver', 'INR', 'Petrol', 'Diesel', 'LP Gas'])",
  "state": "string (required)",
  "city": "string (required)",
  "price": "number (required, min: 0)",
  "unit": "string (default: 'per unit')",
  "isActive": "boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Note:** The combination of `commodityType`, `state`, and `city` must be unique.

### ApplyNow Model
```json
{
  "_id": "ObjectId",
  "isActive": "boolean (required, default: true)",
  "description": "string (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Note:** 
- Only one ApplyNow settings document should exist in the collection
- The `getSettings()` static method ensures a single document exists
- If no document exists, a default one is created with `isActive: true`

---

## Example API Workflow

### Complete Workflow Example

1. **Admin Signup**
   ```
   POST /api/auth/signup
   → Returns token
   ```

2. **Admin Login** (Alternative)
   ```
   POST /api/auth/login
   → Returns token
   ```

3. **Create Category** (Using token from step 1 or 2)
   ```
   POST /api/admin/categories
   Headers: Authorization: Bearer <token>
   → Returns category with ID
   ```

4. **Create Loan** (Using token and category ID)
   ```
   POST /api/admin/loans
   Headers: Authorization: Bearer <token>
   Body: { category: "<category_id>", ... }
   → Returns loan with ID
   ```

5. **Get Public Categories** (No authentication needed)
   ```
   GET /api/public/categories
   → Returns all active categories
   ```

6. **Get Public Loans** (No authentication needed)
   ```
   GET /api/public/loans?category=<category_id>
   → Returns all active loans for category
   ```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 30 days
- Public APIs only return resources where `isActive: true`
- Admin APIs can access both active and inactive resources
- All IDs are MongoDB ObjectIds
- The `__v` field (MongoDB version key) is excluded from public API responses

---

## Support

For issues or questions, please refer to the main README.md file or contact the development team.

