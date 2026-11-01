import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { CustomError } from '../../common/middleware/errorHandler';
import { AuthRequest } from '../../common/middleware/auth';
import { generateCsrfToken, storeCsrfToken, clearCsrfToken, getCsrfToken } from '../../common/utils/csrf';

const getCookieOptions = (req: Request, maxAge: number) => {
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
  // Cross-site cookies (e.g. Vercel to Render) REQUIRE sameSite: 'none' and secure: true
  // We use SameSite: None for all non-localhost to ensure it works across different domains
  return {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: (isLocalhost ? 'lax' : 'none') as 'none' | 'lax' | 'strict',
    maxAge
  };
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError('Email and Password are required', 400);
    }
    const { user, tokens } = await authService.login(email, password);

    // Set access token in HTTP-only cookie
    res.cookie('accessToken', tokens.accessToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Generate stateless CSRF token
    const csrfToken = generateCsrfToken(user._id.toString());
    // storeCsrfToken(user._id.toString(), csrfToken);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken: tokens.accessToken,
        csrfToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      throw new CustomError('Refresh token required', 400);
    }

    const { accessToken } = await authService.refreshToken(refreshToken);

    // Set new access token in httpOnly cookie
    res.cookie('accessToken', accessToken, getCookieOptions(req, 15 * 60 * 1000));

    res.json({
      success: true,
      data: { accessToken } // Also return in body for backward compatibility
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not found', 404);
    }

    const user = await authService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not found', 404);
    }

    await authService.logout(req.user.id);

    // Clear CSRF token (No-op in stateless, but good practice to remove if present)
    clearCsrfToken(req.user.id);

    // Clear both cookies
    const cookieOptions = getCookieOptions(req, 0);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not found', 404);
    }

    const { name, phone, currentPassword, newPassword } = req.body;

    const user = await authService.updateProfile(req.user.id, {
      name,
      phone,
      currentPassword,
      newPassword
    });

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get CSRF token for authenticated users
export const getCsrfTokenController = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    // Check if CSRF token already exists
    let csrfToken = getCsrfToken(req.user.id);

    // If not, generate a new one
    if (!csrfToken) {
      csrfToken = generateCsrfToken(req.user.id);
      // storeCsrfToken(req.user.id, csrfToken); // Stateless
    }

    res.json({
      success: true,
      data: { csrfToken }
    });
  } catch (error) {
    next(error);
  }
};

export const identify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      throw new CustomError('Name and Phone are required', 400);
    }
    const { user, tokens } = await authService.identifyCustomer(name, phone);

    // Set access token in HTTP-only cookie
    res.cookie('accessToken', tokens.accessToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Generate stateless CSRF token
    const csrfToken = generateCsrfToken(user._id.toString());
    // storeCsrfToken no longer needed for stateless

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken: tokens.accessToken,
        csrfToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new CustomError('Phone number is required', 400);
    }
    await authService.sendOTP(phone);
    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      throw new CustomError('Phone and OTP are required', 400);
    }
    const { user, tokens } = await authService.verifyOTP(phone, otp);

    // Set access token in HTTP-only cookie
    res.cookie('accessToken', tokens.accessToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(req, 7 * 24 * 60 * 60 * 1000));

    // Generate stateless CSRF token
    const csrfToken = generateCsrfToken(user._id.toString());
    // storeCsrfToken no longer needed for stateless

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken: tokens.accessToken,
        csrfToken
      }
    });
  } catch (error) {
    next(error);
  }
};
