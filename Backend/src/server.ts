import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';

// ... (imports)
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { connectDB } from './config/database';
import apiRoutes from './routes';
import { requestLogger } from './common/middleware/requestLogger';
import { logger } from './common/utils/logger';
import { rateLimiter } from './common/middleware/rateLimiter';
import { notFoundHandler } from './common/middleware/notFoundHandler';
import { errorHandler } from './common/middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = (process.env.API_VERSION && process.env.API_VERSION.trim()) || 'v1';

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'https://www.rajahomedecor.com',
  'https://rajahomedecor.com',
  'https://raja-home-decor.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Normalize origin and whitelist entries (remove trailing slashes)
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === normalizedOrigin) ||
      normalizedOrigin.endsWith('.vercel.app') ||
      normalizedOrigin.endsWith('.onrender.com');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// MongoDB injection prevention
app.use(mongoSanitize());

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Static file serving (for uploads)
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath, { maxAge: '30d' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sitemap generator
import { generateSitemap } from './modules/sitemap/sitemap.controller';
app.get('/sitemap.xml', generateSitemap);

// CSRF protection (applied to all API routes except auth endpoints)
// Auth endpoints (send-otp, verify-otp) are excluded as they don't require CSRF
import { csrfProtection } from './common/middleware/csrf';
app.use(`/api/${API_VERSION}`, csrfProtection);

// API routes
logger.info(`Mounting API routes at: /api/${API_VERSION}`);
app.use(`/api/${API_VERSION}`, apiRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      const apiBase = `/api/${API_VERSION}`;
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 API available at http://localhost:${PORT}${apiBase}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

      // List all registered routes for debugging in dev
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Registered Routes:');
        app._router.stack.forEach((middleware: any) => {
          if (middleware.route) { // routes registered directly on the app
            logger.info(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
          } else if (middleware.name === 'router') { // router middleware
            middleware.handle.stack.forEach((handler: any) => {
              if (handler.route) {
                const path = handler.route.path;
                const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
                logger.info(`${methods} ${apiBase}${path}`);
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
