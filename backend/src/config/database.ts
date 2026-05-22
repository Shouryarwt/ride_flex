import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const defaultDb = 'ride_flex';
    const mongoUri = process.env.MONGODB_URI || `mongodb://localhost:27017/${defaultDb}`;
    const connectOptions = {} as mongoose.ConnectOptions;

    const usesRootUri = /^mongodb(?:\+srv)?:\/\/[\w.@-]+(?::\d+)?\/?$/.test(mongoUri);
    if (usesRootUri) {
      connectOptions.dbName = defaultDb;
    }

    await mongoose.connect(mongoUri, connectOptions);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});
