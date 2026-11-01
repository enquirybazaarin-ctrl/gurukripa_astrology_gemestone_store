import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  if (!err.isOperational || statusCode >= 500) {
    logger.error('Unhandled Error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  } else {
    // For expected API errors, log as warn instead of error and don't print full stack
    logger.warn('Client Error', {
      error: err.message,
      statusCode,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  }

  // Map technical errors to user-friendly messages
  const getUserFriendlyMessage = (error: AppError): string => {
    const errorMap: Record<number, Record<string, string>> = {
      400: {
        'Refresh token required': 'Your session has expired. Please log in again.',
        'Invalid credentials': 'The information you entered is incorrect. Please try again.',
        'Validation error': 'The information provided is invalid. Please check and try again.',
        'default': 'The information provided is invalid. Please check and try again.'
      },
      401: {
        'Invalid refresh token': 'Your session has expired. Please log in again.',
        'Invalid or expired refresh token': 'Your session has expired. Please log in again.',
        'Authentication required': 'Please log in to continue.',
        'Invalid token': 'Your session has expired. Please log in again.',
        'Unauthorized': 'Please log in to continue.',
        'default': 'Please log in to continue.'
      },
      403: {
        'CSRF token missing': 'Security validation failed. Please refresh and try again.',
        'Invalid CSRF token': 'Security validation failed. Please refresh and try again.',
        'Forbidden': 'You don\'t have permission to perform this action.',
        'default': 'You don\'t have permission to perform this action.'
      },
      404: {
        'User not found': 'Account not found. Please check your information.',
        'Not found': 'The requested resource was not found.',
        'default': 'The requested resource was not found.'
      },
      409: {
        'Conflict': 'This resource already exists.',
        'default': 'This resource already exists.'
      },
      500: {
        'default': 'Something went wrong. Please try again later.'
      }
    };

    const statusCode = error.statusCode || 500;
    const statusMessages = errorMap[statusCode] || errorMap[500];

    return statusMessages[error.message] || statusMessages['default'];
  };

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message, // Technical message (for debugging)
      userMessage: getUserFriendlyMessage(err), // User-friendly message
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
