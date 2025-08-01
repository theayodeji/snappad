// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Your User model
import { SignJWT } from 'jose';
import Error from 'next/error';

// Ensure you have a JWT secret in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_very_long_and_random_for_dev'; // CHANGE THIS IN PRODUCTION!
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// Helper to generate a JWT token
const generateToken = async (id: string) => {
  return new SignJWT({ id }) // Payload
    .setProtectedHeader({ alg: 'HS256' }) // Algorithm for signing
    .setIssuedAt() // Set 'iat' claim
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(encodedSecret); // Sign with your secret
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

    if (!user.verified) {
      
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        message: 'Account not verified. Please verify your email.',
        email: user.email,
      }, { status: 403 });
    }

    // Generate JWT token
    const token = await generateToken(user._id.toString());

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
          verified: user.verified,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error.',
        error: error
      },
      { status: 500 }
    );
  }
}