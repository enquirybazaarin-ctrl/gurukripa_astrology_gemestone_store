import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

const isDev = process.env.NODE_ENV !== 'production';
const isFixedOtpEnabled = isDev && process.env.AUTH_FIXED_OTP_ENABLED === 'true';

export const rateLimiter = rateLimit({
  windowMs,
  max: isDev ? 3000 : maxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  // In dev (especially when fixed OTP is enabled) we allow more attempts to avoid blocking local testing.
  windowMs: isDev ? 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? (isFixedOtpEnabled ? 1000 : 50) : 5,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Fraud protection for orders
export const orderRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 orders per hour
  message: {
    success: false,
    error: {
      message: 'Order limit exceeded. Please try again after an hour.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
