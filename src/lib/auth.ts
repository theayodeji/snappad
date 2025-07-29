// src/lib/auth.ts

import { jwtVerify, type JWTPayload } from 'jose';
import { NextRequest } from 'next/server'; // Use NextRequest for consistency if needed, or just Request

// Define the structure of your JWT payload
// Ensure this matches what you put into the token during login/register
interface TokenPayload extends JWTPayload {
  id: string; // The user's MongoDB ObjectId
  email?: string; // Optional: if you store email in token
  role?: 'user' | 'owner' | 'admin'; // Optional: if you store role in token
}

// Your JWT secret key (MUST be a strong, random string in .env.local for production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_very_long_and_random_for_dev';

// Encode the secret for jose (symmetric key)
const encodedSecret = new TextEncoder().encode(JWT_SECRET);


export async function verifyAuth(req: NextRequest): Promise<TokenPayload> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header.');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ['HS256'], // Specify the algorithm used for signing
    });
    
    // Cast the payload to your custom TokenPayload interface
    return payload as TokenPayload;
  } catch (err: any) {
    console.error('Token verification failed:', err.message);
    // Provide more specific error messages based on jose's error codes if desired
    if (err.code === 'ERR_JWS_INVALID') {
      throw new Error('Invalid token signature.');
    } else if (err.code === 'ERR_JWT_EXPIRED') {
      throw new Error('Token expired.');
    } else if (err.code === 'ERR_JWT_MALFORMED') {
      throw new Error('Malformed token.');
    }
    throw new Error('Authentication failed.'); // Generic fallback for other errors
  }
}

export async function safeVerifyAuth(req: NextRequest): Promise<TokenPayload | null> {
  try {
    return await verifyAuth(req);
  } catch {
    return null; // Catch any errors from verifyAuth and return null
  }
}
