# 🚗 Ride Flex - Vehicle Rental Platform

A modern, full-stack vehicle rental platform built with React and TypeScript. Rent bikes, scooters, and cars with ease.

## ✨ Features

### For Customers (Users)
- 🔐 Secure authentication with JWT
- 🔍 Browse and filter vehicles by city, type, and price
- 📅 Book vehicles with date/time selection
- 💳 Multiple payment methods (UPI, Card, Net Banking, Wallet)
- 📱 View booking history and status
- 👤 Profile management with DL verification
- 🌙 Dark mode support

### For Dealers (Sellers)
- 🏪 Complete dealer profile with GST verification
- 🚙 Add and manage vehicle listings
- 📊 View and manage bookings
- ✅ Approve/reject booking requests
- 💰 Track earnings and payments
- 📄 Document upload for verification

### Technical Features
- ⚡ Built with modern tech stack
- 🔒 Role-based access control
- 🛡️ Security best practices (Helmet, CORS, Rate Limiting)
- 📱 Fully responsive design
- 🎨 Beautiful UI with Tailwind CSS
- 🔄 Real-time updates
- 📝 Input validation with Zod
- 🗄️ MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Validation**: Zod
- **Dev Tools**: tsx (hot reload)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **PDF Generation**: jsPDF

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
install.bat
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ride-flex
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

5. **Start backend server**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

6. **Start frontend server** (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed installation and configuration
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Backend README](backend/README.md) - Backend-specific documentation

## 🏗️ Project Structure

```
ride-flex/
├── backend/                    # TypeScript backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   └── server.ts          # Entry point
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── api/              # API integration layer
│   │   ├── components/       # React components
│   │   └── ...
│   ├── .env                  # Frontend environment
│   └── package.json
│
├── SETUP.md                  # Setup guide
├── API_DOCUMENTATION.md      # API docs
├── README.md                 # This file
├── install.bat               # Windows installer
└── install.sh                # Unix installer
```

## 🔑 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride-flex
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-api-key
```

## 🧪 Testing the Application

### 1. Register as a Customer
- Navigate to http://localhost:5173/auth
- Select "Customer" role
- Fill in registration details
- Login and explore the dashboard

### 2. Register as a Dealer
- Navigate to http://localhost:5173/auth
- Select "Dealer (Seller)" role
- Provide GST number and business details
- Upload required documents
- Login to manage vehicles

### 3. Test API Endpoints
Use the provided [API Documentation](API_DOCUMENTATION.md) to test endpoints with Postman or Thunder Client.

## 📱 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register user/seller
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle (seller)
- `PUT /api/vehicles/:id` - Update vehicle (seller)
- `DELETE /api/vehicles/:id` - Delete vehicle (seller)

### Bookings
- `POST /api/bookings` - Create booking (user)
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/seller-bookings` - Get seller bookings
- `PUT /api/bookings/:id/status` - Update status (seller)
- `PUT /api/bookings/:id/cancel` - Cancel booking (user)

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/my-payments` - Get user payments
- `GET /api/payments/booking/:bookingId` - Get payment by booking

### Dealers
- `GET /api/dealers/profile` - Get dealer profile
- `PUT /api/dealers/profile` - Update dealer profile
- `GET /api/dealers` - Get all dealers
- `PUT /api/dealers/:id/approve` - Approve dealer (admin)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control (User, Seller, Admin)
- Rate limiting (100 requests per 15 minutes)
- Helmet for security headers
- CORS configuration
- Input validation with Zod
- MongoDB injection prevention
- XSS protection

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
```bash
# Backend: Change PORT in backend/.env
# Frontend: Vite will suggest another port automatically
```

### CORS Errors
- Ensure backend CORS_ORIGIN matches frontend URL
- Check if both servers are running

### JWT Token Errors
- Clear browser localStorage
- Re-login to get a fresh token

## 🚀 Deployment

### Backend (Railway/Heroku/AWS)
1. Build: `npm run build`
2. Set environment variables
3. Use MongoDB Atlas for database
4. Deploy `dist` folder

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Update `VITE_API_URL` to production backend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for modern vehicle rental solutions

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for beautiful styling
- All open-source contributors

---

**Happy Coding! 🚗💨**

For detailed setup instructions, see [SETUP.md](SETUP.md)
For API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
