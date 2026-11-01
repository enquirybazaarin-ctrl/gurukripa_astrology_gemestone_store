import { User, IUser } from './auth.model';
import { generateTokens } from '../../common/utils/jwt';
import { CustomError } from '../../common/middleware/errorHandler';

// Auth Service for Admin & Guest support
export class AuthService {
  async login(email: string, password: string): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      phone: user.phone || '',
      email: user.email,
      role: user.role
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const jwt = await import('jsonwebtoken');

    try {
      // Verify token signature
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
        id: string;
        email: string;
        phone: string;
        role: 'customer' | 'admin';
      };

      // Find user and verify refresh token matches
      const user = await User.findById(decoded.id).select('+refreshToken');
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Verify refresh token matches stored token
      if (user.refreshToken !== refreshToken) {
        throw new CustomError('Invalid refresh token', 401);
      }

      // Generate new access token
      const { generateTokens } = await import('../../common/utils/jwt');
      const tokens = generateTokens({
        id: user._id.toString(),
        phone: user.phone,
        email: user.email,
        role: user.role
      });

      // Return only access token (refresh token remains the same)
      return { accessToken: tokens.accessToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid or expired refresh token', 401);
      }
      throw error;
    }
  }

  async getCurrentUser(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; currentPassword?: string; newPassword?: string }): Promise<IUser> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (data.name) user.name = data.name;
    if (data.phone) user.phone = data.phone;

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new CustomError('Current password is required to change password', 400);
      }
      const isMatch = await user.comparePassword(data.currentPassword);
      if (!isMatch) {
        throw new CustomError('Invalid current password', 401);
      }
      user.password = data.newPassword;
    }

    await user.save();

    // Return user without sensitive data
    const updatedUser = await User.findById(userId);
    return updatedUser!;
  }

  async identifyCustomer(name: string, phone: string): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        name,
        phone,
        role: 'customer'
      });
    } else {
      // Update name if missing or if admin wants to ensure record is complete
      if (name && (!user.name || user.name === 'Guest')) {
        user.name = name;
        await user.save();
      }
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      phone: user.phone || '',
      email: user.email || '',
      role: user.role
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  async sendOTP(phone: string): Promise<string> {
    const isDev = process.env.NODE_ENV !== 'production';
    const isFixedOtpEnabled = isDev && process.env.AUTH_FIXED_OTP_ENABLED === 'true';
    const otp = isFixedOtpEnabled ? process.env.AUTH_FIXED_OTP_CODE || '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, role: 'customer' });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // In a real app, send via SMS service here
    console.log(`OTP for ${phone}: ${otp}`);

    return otp;
  }

  async verifyOTP(phone: string, otp: string): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await User.findOne({
      phone,
      otp,
      otpExpires: { $gt: new Date() }
    }).select('+otp +otpExpires');

    if (!user) {
      throw new CustomError('Invalid or expired OTP', 400);
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;

    const tokens = generateTokens({
      id: user._id.toString(),
      phone: user.phone || '',
      email: user.email || '',
      role: user.role
    });

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }
}

export const authService = new AuthService();
