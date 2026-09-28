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

dotenv.config();

export const app = express();
// Vercel terminates TLS/proxying in front of Express; trust the first proxy hop.
app.set('trust proxy', 1);

const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const vercelOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  : '';

const allowedOrigins = new Set([...configuredOrigins, vercelOrigin].filter(Boolean));

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Same-origin requests and non-browser requests do not send an Origin header.
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

if (process.env.NODE_ENV !== 'test') {
  app.use('/api', async (_req, _res, next) => {
    try {
      await connectDatabase();
      next();
    } catch (error) {
      next(error);
    }
  });
}

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ride Flex API v2.0 - Running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };

  res.status(200).json({
    success: true,
    status: 'ok',
    database: dbStatusMap[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ready', async (_req, res) => {
  try {
    await connectDatabase();
    res.status(200).json({
      success: true,
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'not_ready',
      database: 'disconnected',
      message: error instanceof Error ? error.message : 'Database unavailable',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
