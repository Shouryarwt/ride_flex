import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  connectionPromise = mongoose.connect(mongoUri, {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
    serverSelectionTimeoutMS: 5000,
  });

  try {
    const connection = await connectionPromise;
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return connection;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});
