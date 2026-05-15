# Ride Flex API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication Endpoints

### Register User/Seller
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "role": "user",
  "city": "Mumbai",
  "dlNumber": "MH1234567890",
  "profilePic": "base64_or_url"
}
```

**For Sellers, add:**
```json
{
  "gstNumber": "27AAPFU0939F1ZV",
  "shopName": "ABC Motors",
  "address": "123 Main St",
  "bankName": "HDFC Bank",
  "accountNo": "1234567890",
  "ifsc": "HDFC0001234",
  "idProof": "base64_string",
  "gstProof": "base64_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user",
    "isVerified": false
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "identifier": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user",
    "isVerified": false,
    "city": "Mumbai"
  }
}
```

### Get Profile
**GET** `/auth/profile` 🔒

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user",
    "city": "Mumbai",
    "dlNumber": "MH1234567890",
    "profilePic": "url",
    "isVerified": false
  }
}
```

### Update Profile
**PUT** `/auth/profile` 🔒

**Body:**
```json
{
  "name": "John Updated",
  "city": "Delhi",
  "dlNumber": "DL1234567890",
  "profilePic": "new_url"
}
```

### Change Password
**PUT** `/auth/change-password` 🔒

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Vehicle Endpoints

### Get All Vehicles
**GET** `/vehicles`

**Query Parameters:**
- `city` (optional): Filter by city
- `type` (optional): bike, scooter, car
- `minPrice` (optional): Minimum price per day
- `maxPrice` (optional): Maximum price per day
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:** `/vehicles?city=Mumbai&type=bike&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "vehicles": [
    {
      "id": "vehicle_id",
      "title": "Honda Activa 6G",
      "description": "Well maintained",
      "type": "scooter",
      "engineSegment": "110cc",
      "city": "Mumbai",
      "images": ["url1", "url2"],
      "pricePerHour": 50,
      "pricePerDay": 400,
      "deliveryAvailable": true,
      "deliveryChargePerKm": 5,
      "isActive": true,
      "seller": {
        "name": "Seller Name",
        "email": "seller@example.com"
      },
      "dealer": {
        "shopName": "ABC Motors",
        "city": "Mumbai"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Vehicle by ID
**GET** `/vehicles/:id`

### Get My Vehicles (Seller Only)
**GET** `/vehicles/my-vehicles` 🔒 👤 Seller

### Create Vehicle (Seller Only)
**POST** `/vehicles` 🔒 👤 Seller

**Body:**
```json
{
  "title": "Honda Activa 6G",
  "description": "Well maintained scooter",
  "type": "scooter",
  "engineSegment": "110cc",
  "city": "Mumbai",
  "images": ["url1", "url2"],
  "pricePerHour": 50,
  "pricePerDay": 400,
  "deliveryAvailable": true,
  "deliveryChargePerKm": 5
}
```

### Update Vehicle (Seller Only)
**PUT** `/vehicles/:id` 🔒 👤 Seller

### Delete Vehicle (Seller Only)
**DELETE** `/vehicles/:id` 🔒 👤 Seller

---

## Booking Endpoints

### Create Booking (User Only)
**POST** `/bookings` 🔒 👤 User

**Body:**
```json
{
  "vehicleId": "vehicle_id",
  "startDate": "2024-03-20T10:00:00Z",
  "endDate": "2024-03-21T10:00:00Z",
  "totalHours": 24,
  "totalAmount": 400
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": "booking_id",
    "user": "user_id",
    "vehicle": {
      "title": "Honda Activa 6G",
      "type": "scooter"
    },
    "startDate": "2024-03-20T10:00:00Z",
    "endDate": "2024-03-21T10:00:00Z",
    "totalHours": 24,
    "totalAmount": 400,
    "bookingStatus": "pending",
    "paymentStatus": "unpaid"
  }
}
```

### Get My Bookings (User Only)
**GET** `/bookings/my-bookings` 🔒 👤 User

### Get Seller Bookings (Seller Only)
**GET** `/bookings/seller-bookings` 🔒 👤 Seller

### Get Booking by ID
**GET** `/bookings/:id` 🔒

### Update Booking Status (Seller Only)
**PUT** `/bookings/:id/status` 🔒 👤 Seller

**Body:**
```json
{
  "status": "confirmed"
}
```

**Status Options:** pending, confirmed, cancelled, completed

### Cancel Booking (User Only)
**PUT** `/bookings/:id/cancel` 🔒 👤 User

---

## Payment Endpoints

### Create Payment
**POST** `/payments` 🔒

**Body:**
```json
{
  "bookingId": "booking_id",
  "amount": 400,
  "paymentMethod": "upi"
}
```

**Payment Methods:** card, upi, netbanking, wallet

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment": {
    "id": "payment_id",
    "booking": "booking_id",
    "user": "user_id",
    "amount": 400,
    "paymentMethod": "upi",
    "transactionId": "TXN1234567890",
    "status": "success"
  }
}
```

### Get My Payments
**GET** `/payments/my-payments` 🔒

### Get Payment by Booking
**GET** `/payments/booking/:bookingId` 🔒

---

## Dealer Endpoints

### Get Dealer Profile (Seller Only)
**GET** `/dealers/profile` 🔒 👤 Seller

### Update Dealer Profile (Seller Only)
**PUT** `/dealers/profile` 🔒 👤 Seller

**Body:**
```json
{
  "shopName": "Updated Shop Name",
  "address": "New Address",
  "city": "Mumbai",
  "bankName": "HDFC Bank",
  "accountNo": "1234567890",
  "ifsc": "HDFC0001234"
}
```

### Get All Dealers
**GET** `/dealers`

**Query Parameters:**
- `city` (optional): Filter by city
- `approvalStatus` (optional): pending, approved, rejected

### Approve/Reject Dealer (Admin Only)
**PUT** `/dealers/:id/approve` 🔒 👤 Admin

**Body:**
```json
{
  "status": "approved"
}
```

**Status Options:** approved, rejected

---

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` endpoints

---

## Notes

🔒 = Requires authentication
👤 = Requires specific role

### Role Hierarchy
- **User**: Can book vehicles, make payments
- **Seller**: Can create/manage vehicles, view bookings
- **Admin**: Can approve dealers, manage all resources
