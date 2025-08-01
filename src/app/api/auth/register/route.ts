import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { randomInt } from 'crypto';
import { sendOtpMail } from '@/lib/mailer'; // You’ll define this

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password, name, phone, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // Create user with verified: false
    const user = await User.create({
      email,
      password,
      name,
      phone,
      role,
      verified: false,
    });

    // Generate OTP
    const otp = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Save OTP in DB
    await Otp.findOneAndUpdate(
      { user: user._id },
      { otp, expiresAt },
      { upsert: true }
    );

    // Send OTP
    await sendOtpMail(email, otp);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered. OTP sent to email.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

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
