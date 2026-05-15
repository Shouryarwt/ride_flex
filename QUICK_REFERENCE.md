# 🚀 Quick Reference Card

## Installation

```bash
# Windows
install.bat

# Unix/Linux/macOS
chmod +x install.sh && ./install.sh
```

## Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Base: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Common Commands

### Backend
```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride-flex
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Quick Test

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "9876543210",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "password123"
  }'
```

### Get Vehicles
```bash
curl http://localhost:5000/api/vehicles
```

## User Roles

- **user**: Can book vehicles, make payments
- **seller**: Can create/manage vehicles, view bookings
- **admin**: Can approve dealers, manage all resources

## Common Issues

### MongoDB not running
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port already in use
- Backend: Change PORT in backend/.env
- Frontend: Vite will suggest another port

### CORS errors
- Check CORS_ORIGIN in backend/.env matches frontend URL
- Ensure both servers are running

### JWT token errors
- Clear browser localStorage
- Re-login to get fresh token

## File Structure

```
ride-flex/
├── backend/src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Database schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth, validation, errors
│   └── server.ts      # Entry point
│
└── frontend/src/
    ├── api/           # API integration
    └── components/    # React components
```

## Key Files

- `backend/src/server.ts` - Backend entry point
- `frontend/main.jsx` - Frontend entry point
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `API_DOCUMENTATION.md` - Complete API reference
- `SETUP.md` - Detailed setup guide

## Database Models

- **User**: Authentication and profile
- **Dealer**: Seller business information
- **Vehicle**: Vehicle listings
- **Booking**: Rental bookings
- **Payment**: Payment transactions

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile` 🔒
- PUT `/api/auth/profile` 🔒
- PUT `/api/auth/change-password` 🔒

### Vehicles
- GET `/api/vehicles`
- GET `/api/vehicles/:id`
- POST `/api/vehicles` 🔒 (seller)
- PUT `/api/vehicles/:id` 🔒 (seller)
- DELETE `/api/vehicles/:id` 🔒 (seller)

### Bookings
- POST `/api/bookings` 🔒 (user)
- GET `/api/bookings/my-bookings` 🔒 (user)
- GET `/api/bookings/seller-bookings` 🔒 (seller)
- PUT `/api/bookings/:id/status` 🔒 (seller)
- PUT `/api/bookings/:id/cancel` 🔒 (user)

### Payments
- POST `/api/payments` 🔒
- GET `/api/payments/my-payments` 🔒
- GET `/api/payments/booking/:bookingId` 🔒

### Dealers
- GET `/api/dealers/profile` 🔒 (seller)
- PUT `/api/dealers/profile` 🔒 (seller)
- GET `/api/dealers`
- PUT `/api/dealers/:id/approve` 🔒 (admin)

🔒 = Requires authentication

## Testing Credentials

After registration, use your own credentials. Example:
```json
{
  "identifier": "your-email@example.com",
  "password": "your-password"
}
```

## Documentation

- 📖 [README.md](README.md) - Project overview
- 🔧 [SETUP.md](SETUP.md) - Setup guide
- 📚 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- 🔄 [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Migration details

## Support

Check the documentation files for detailed information:
1. Start with README.md for overview
2. Follow SETUP.md for installation
3. Use API_DOCUMENTATION.md for API details
4. Check MIGRATION_SUMMARY.md for architecture

---

**Happy Coding! 🚗💨**
