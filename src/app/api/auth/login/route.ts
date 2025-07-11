// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Your User model
import jwt from 'jsonwebtoken'; // For generating JWTs

// Ensure you have a JWT secret in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // CHANGE THIS IN PRODUCTION!

// Helper to generate a JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// POST /api/auth/login
// Handles user login.
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find user by email, explicitly select password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}