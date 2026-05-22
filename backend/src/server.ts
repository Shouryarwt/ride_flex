import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { connectDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import dealerRoutes from './routes/dealer.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { User } from './models/User.model.js';


dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = 'rwtshourya@gmail.com';
const ADMIN_PASSWORD = 'Rawat@0788';

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDatabase();
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased to avoid blocking auth usage
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser. Seller inventory currently submits base64 previews/documents in JSON.
app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ extended: true, limit: '80mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ride Flex API v2.0 - Running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: { [key: number]: string } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };

  const isHealthy = dbState === 1;

  res.status(200).json({
    success: true,
    status: isHealthy ? 'healthy' : 'degraded',
    database: dbStatusMap[dbState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handling

app.use(notFound);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // Ensure the Admin user exists with the expected credentials.
    User.findOne({ email: ADMIN_EMAIL }).select('+password').then(async (admin) => {
      if (!admin) {
        User.create({
          name: 'Shourya rawat',
          email: ADMIN_EMAIL,
          mobile: '7300656060', // A required 10-digit fallback
          password: ADMIN_PASSWORD,
          role: 'admin'
        }).then(() => console.log('✅ Admin user "Shourya rawat" successfully created!'))
          .catch(err => console.error('⚠️ Failed to create admin:', err.message));
        return;
      }
      const hasExpectedPassword = await admin.comparePassword(ADMIN_PASSWORD);
      if (!hasExpectedPassword || admin.role !== 'admin') {
        admin.password = ADMIN_PASSWORD;
        admin.role = 'admin';
        await admin.save();
        console.log('Admin user "Shourya rawat" credentials updated.');
      }
    }).catch(err => console.error('⚠️ Error checking admin user:', err.message));

    console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║   🚗 Ride Flex Backend v2.0                                       ║
║   Server running on port ${PORT}                                  ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
╚═══════════════════════════════════════════════════════════════════╝
    `);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
