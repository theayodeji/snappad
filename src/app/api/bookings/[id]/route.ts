// src/app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming your dbConnect utility is here
import Booking from '@/models/Booking'; // Import your Booking model

// GET /api/bookings/[id]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Get the dynamic 'id' from params
) {
  await dbConnect(); // Connect to your database

  const { id } = await params;

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    const booking = await Booking.findById(id).populate('property');

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { id } = params;

  try {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Booking cancelled successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}