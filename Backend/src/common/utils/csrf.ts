import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'votive-secure-csrf-secret-key-2024';

/**
 * Generate a stateless signed CSRF token
 * Format: userId.timestamp.random.signature
 */
export const generateCsrfToken = (userId: string): string => {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const payload = `${userId}.${timestamp}.${random}`;

    const signature = crypto
        .createHmac('sha256', CSRF_SECRET)
        .update(payload)
        .digest('hex');

    return `${payload}.${signature}`;
};

/**
 * Validate a stateless CSRF token
 */
export const validateCsrfToken = (userId: string, token: string): boolean => {
    if (!token || !token.includes('.')) return false;

    const parts = token.split('.');
    if (parts.length !== 4) return false;

    const [tokenUserId, timestampStr, random, signature] = parts;

    // 1. Verify User ID matches
    if (tokenUserId !== userId) return false;

    // 2. Verify Timestamp (optional: expire after 24h)
    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    if (isNaN(timestamp) || now - timestamp > 24 * 60 * 60 * 1000) {
        return false;
    }

    // 3. Verify Signature
    const payload = `${tokenUserId}.${timestampStr}.${random}`;
    const expectedSignature = crypto
        .createHmac('sha256', CSRF_SECRET)
        .update(payload)
        .digest('hex');

    // Timing safe compare
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
};

// Deprecated: No-op for backward compatibility during refactor
export const storeCsrfToken = (userId: string, token: string): void => {
    // Stateless: verification happens via signature, no storage needed
};

// Deprecated: No-op
export const getCsrfToken = (userId: string): string | undefined => {
    return undefined;
};

// Deprecated: No-op
export const clearCsrfToken = (userId: string): void => {
    // Stateless: cannot clear, but token has timestamp expiry
};
