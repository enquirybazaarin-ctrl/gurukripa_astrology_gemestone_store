import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export const DEFAULT_JWT_SECRET = 'gurukripa_jwt_secret_key_2026_astrology_gemstone_9323600011';
export const DEFAULT_JWT_REFRESH_SECRET = 'gurukripa_jwt_refresh_secret_key_2026_astrology_gemstone_9323600011';

export const generateTokens = (payload: TokenPayload): { accessToken: string; refreshToken: string } => {
  const secret = (process.env.JWT_SECRET || DEFAULT_JWT_SECRET) as Secret;
  const refreshSecret = (process.env.JWT_REFRESH_SECRET || DEFAULT_JWT_REFRESH_SECRET) as Secret;

  const accessToken = sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  } as SignOptions);

  const refreshToken = sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string): TokenPayload => {
  return verify(token, secret) as TokenPayload;
};
