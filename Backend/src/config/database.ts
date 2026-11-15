import mongoose from 'mongoose';
import { logger } from '../common/utils/logger';

const DEFAULT_ATLAS_URI = 'mongodb+srv://enquirybazaarin_db_user:Guruji-2023@cluster0.9xnhxqy.mongodb.net/gurukripa_gemstone?retryWrites=true&w=majority';
export let lastDbError: string | null = null;

export const connectDB = async (): Promise<void> => {
  const rawUri = (process.env.MONGODB_URI || DEFAULT_ATLAS_URI).trim().replace(/^["']|["']$/g, '');
  const uri = rawUri.startsWith('mongodb') ? rawUri : DEFAULT_ATLAS_URI;

  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 10000,
      });
      lastDbError = null;
      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
      lastDbError = error?.message || String(error);
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
