# Ride Flex - Complete Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file is already created with default values. Update if needed:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride-flex
JWT_SECRET=ride-flex-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 5. Start Backend Server
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDbAbJhBIgVy1RuTPg-o33QcbgdkeZTYC8
```

### 4. Start Frontend Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Testing the Application

### 1. Register a User
- Go to `http://localhost:5173/auth`
- Select "Customer" role
- Fill in the registration form
- Submit

### 2. Register a Seller
- Go to `http://localhost:5173/auth`
- Select "Dealer (Seller)" role
- Fill in all required fields including GST number
- Upload documents
- Submit

### 3. Login
- Use email/mobile and password to login
- You'll be redirected to the appropriate dashboard

## API Testing with Postman/Thunder Client

### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "role": "user",
  "city": "Mumbai",
  "dlNumber": "MH1234567890"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Get Vehicles
```http
GET http://localhost:5000/api/vehicles?city=Mumbai&type=bike
```

### Create Vehicle (Seller only)
```http
POST http://localhost:5000/api/vehicles
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Honda Activa 6G",
  "description": "Well maintained scooter",
  "type": "scooter",
  "engineSegment": "110cc",
  "city": "Mumbai",
  "pricePerHour": 50,
  "pricePerDay": 400,
  "deliveryAvailable": true,
  "deliveryChargePerKm": 5,
  "images": ["image-url-1", "image-url-2"]
}
```

## Project Structure

```
ride-flex/
├── backend/                 # TypeScript backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   └── server.ts       # Entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend
│   ├── src/
│   │   └── api/           # API integration layer
│   ├── .env               # Frontend environment
│   └── package.json
│
└── SETUP.md               # This file
```

## Key Features

### Backend (TypeScript + Express)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers
- ✅ MongoDB with Mongoose
- ✅ Hot reload with tsx

### Frontend (React + Vite)
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Axios for API calls
- ✅ Tailwind CSS for styling
- ✅ Dark mode support
- ✅ Responsive design

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically suggest another port

### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check if both servers are running

### JWT Token Errors
- Clear localStorage in browser
- Re-login to get a fresh token

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use the health check endpoint: `http://localhost:5000/api/health`
3. **Database GUI**: Use MongoDB Compass to view data
4. **Logs**: Check terminal for detailed error messages

## Production Deployment

### Backend
1. Build TypeScript: `npm run build`
2. Set `NODE_ENV=production` in `.env`
3. Use a strong `JWT_SECRET`
4. Use MongoDB Atlas for database
5. Deploy to services like Heroku, Railway, or AWS

### Frontend
1. Build: `npm run build`
2. Deploy `dist` folder to Vercel, Netlify, or similar
3. Update `VITE_API_URL` to production backend URL

## Support

For issues or questions, check:
- Backend README: `backend/README.md`
- API documentation in route files
- Error messages in terminal/console
