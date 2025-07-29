// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Your User model
import { SignJWT } from 'jose';

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

// POST /api/auth/register
// Handles user registration.
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password, name, phone, role } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Create new user (password hashing handled by Mongoose pre-save hook)
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role
    });

    // Generate JWT token
    const token = await generateToken(user._id.toString());

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully.',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 } // 201 Created
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}