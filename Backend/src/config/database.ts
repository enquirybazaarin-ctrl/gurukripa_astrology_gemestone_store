import mongoose from 'mongoose';
import { logger } from '../common/utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || MONGODB_URI;
  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 15000,
      });
      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error('❌ MongoDB connection error (Check MongoDB Atlas Network Access -> Allow 0.0.0.0/0). Retrying in 5s...', error);
      setTimeout(connectWithRetry, 5000);
    }
  };
  await connectWithRetry();
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error('❌ MongoDB error:', error);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed through app termination');
  process.exit(0);
});
