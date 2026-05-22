import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
  
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.verify(token, secret) as TokenPayload;
};
