// src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this matches your other auth routes!

// GET /api/auth/me
// Verifies token and returns authenticated user's details.
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided.' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    // Find user by ID from the token (do NOT select password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          // Add any other non-sensitive user fields you want the frontend to have
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}