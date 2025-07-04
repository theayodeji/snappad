// src/middleware/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this matches your other auth routes!

// Extend NextRequest to include a user property
interface AuthenticatedRequest extends NextRequest {
  user?: { id: string };
}

// Middleware function to protect API routes
export async function protect(request: AuthenticatedRequest) {
  await dbConnect(); // Ensure DB connection

  let token;

  // Check for token in Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Not authorized, no token' },
      { status: 401 }
    );
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // Attach user to the request (for subsequent route handlers to use)
    // In Next.js App Router, directly modifying the request object for subsequent handlers
    // within the same route file is not straightforward like Express.
    // Instead, you'd typically re-fetch the user or pass the ID.
    // For simplicity in these examples, we'll assume `decoded.id` is available.
    // A more robust pattern might involve a custom `NextApiRequest` type or passing a context.
    
    // For App Router, we'll primarily use `decoded.id` directly in the route handler
    // after this check. This middleware effectively just validates the token.
    
    // Return the decoded ID for the route handler to use
    return { success: true, userId: decoded.id };

  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { success: false, message: 'Not authorized, token failed' },
      { status: 401 }
    );
  }
}