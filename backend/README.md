# Ride Flex Backend v2.0

Modern TypeScript backend for the Ride Flex vehicle rental platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Features

- ✅ TypeScript for type safety
- ✅ JWT-based authentication
- ✅ Role-based access control (User, Seller, Admin)
- ✅ RESTful API design
- ✅ Input validation with Zod
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ MongoDB with Mongoose ODM
- ✅ Hot reload with tsx

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride_flex
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/seller
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Vehicles
- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/:id` - Get vehicle by ID
- `GET /api/vehicles/my-vehicles` - Get seller's vehicles (seller only)
- `POST /api/vehicles` - Create vehicle (seller only)
- `PUT /api/vehicles/:id` - Update vehicle (seller only)
- `DELETE /api/vehicles/:id` - Delete vehicle (seller only)

### Bookings
- `POST /api/bookings` - Create booking (user only)
- `GET /api/bookings/my-bookings` - Get user's bookings (user only)
- `GET /api/bookings/seller-bookings` - Get seller's bookings (seller only)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status (seller only)
- `PUT /api/bookings/:id/cancel` - Cancel booking (user only)

### Payments
- `POST /api/payments` - Create payment (user only)
- `GET /api/payments/my-payments` - Get user's payments
- `GET /api/payments/booking/:bookingId` - Get payment by booking

### Dealers
- `GET /api/dealers/profile` - Get dealer profile (seller only)
- `PUT /api/dealers/profile` - Update dealer profile (seller only)
- `GET /api/dealers` - Get all dealers
- `PUT /api/dealers/:id/approve` - Approve/reject dealer (admin only)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── dealer.controller.ts
│   │   ├── payment.controller.ts
│   │   └── vehicle.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── Booking.model.ts
│   │   ├── Dealer.model.ts
│   │   ├── Payment.model.ts
│   │   ├── User.model.ts
│   │   └── Vehicle.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── dealer.routes.ts
│   │   ├── payment.routes.ts
│   │   └── vehicle.routes.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── asyncHandler.ts
│   │   └── jwt.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Development

- Hot reload is enabled with `tsx watch`
- TypeScript compilation with `tsc`
- ESLint for code quality (optional)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- CORS configuration
- Input validation
- MongoDB injection prevention

## Error Handling

All errors are handled by a centralized error handler that returns consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Stack trace (development only)"
}
```
