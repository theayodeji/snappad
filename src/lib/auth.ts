// src/lib/auth.ts

import { jwtVerify, type JWTPayload } from 'jose';
import { NextRequest } from 'next/server';

interface TokenPayload extends JWTPayload {
  id: string;
  email?: string;
  role?: 'user' | 'owner' | 'admin';
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_very_long_and_random_for_dev';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function verifyAuth(req: NextRequest): Promise<TokenPayload> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ['HS256'],
    });
    
    return payload as TokenPayload;
  } catch (err: unknown) {
    console.error('Token verification failed:', (err as Error).message);

    if (err instanceof Error && err.message === 'ERR_JWS_INVALID') {
      throw new Error('Invalid token signature.');
    } else if (err instanceof Error && err.message === 'ERR_JWT_EXPIRED') {
      throw new Error('Token expired.');
    } else if (err instanceof Error && err.message === 'ERR_JWT_MALFORMED') {
      throw new Error('Malformed token.');
    }
    throw new Error('Authentication failed.'); // Generic fallback for other errors
  }
}

export async function safeVerifyAuth(req: NextRequest): Promise<TokenPayload | null> {
  try {
    return await verifyAuth(req);
  } catch {
    return null;
  }
}
