import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { validateCsrfToken } from '../utils/csrf';
import { CustomError } from './errorHandler';

/**
 * CSRF protection middleware
 * Validates CSRF token for state-changing requests (POST, PUT, PATCH, DELETE)
 * Skips validation for safe methods (GET, HEAD, OPTIONS)
 */
export const csrfProtection = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    // Skip CSRF check for safe methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    // Skip CSRF check if user is not authenticated
    if (!req.user) {
        return next();
    }

    // Get CSRF token from header
    const csrfToken = req.headers['x-csrf-token'] as string;

    if (!csrfToken) {
        return next(new CustomError('CSRF token missing', 403));
    }

    // Validate CSRF token
    const isValid = validateCsrfToken(req.user.id, csrfToken);

    if (!isValid) {
        return next(new CustomError('Invalid CSRF token', 403));
    }

    next();
};
