// src/app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming your dbConnect utility is here
import Property from '@/models/Property'; // Import Property model to get its price and capacity
import Booking, { IBooking } from '@/models/Booking'; // Import Booking model and interface

// POST /api/bookings
// Creates a new booking.
export async function POST(request: NextRequest) {
  await dbConnect(); // Connect to your database

  try {
    const {
      propertyId,
      checkInDate: checkInDateStr,
      checkOutDate: checkOutDateStr,
      numberOfGuests,
      guestMessage, 
      guestId
    } = await request.json();

    // --- 1. Basic Input Validation ---
    if (!propertyId || !checkInDateStr || !checkOutDateStr || !numberOfGuests) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking details.' },
        { status: 400 }
      );
    }

    if(!guestId) {
      return NextResponse.json(
        { success: false, message: 'Guest ID is required.' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format.' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { success: false, message: 'Check-out date must be after check-in date.' },
        { status: 400 }
      );
    }

    if (numberOfGuests <= 0) {
        return NextResponse.json(
            { success: false, message: 'Number of guests must be at least 1.' },
            { status: 400 }
        );
    }

    // --- 2. Fetch Property Details (to get price and capacity) ---
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found.' },
        { status: 404 }
      );
    }

    // --- 3. Validate Number of Guests against Property Capacity ---
    if (numberOfGuests > property.capacity) {
        return NextResponse.json(
            { success: false, message: `Number of guests exceeds property capacity of ${property.capacity}.` },
            { status: 400 }
        );
    }

    // --- 4. CRITICAL: Re-check Availability to Prevent Race Conditions ---
    // This is done again here even if the frontend checked, to ensure atomic operation.
    const overlappingBookings: IBooking[] = await Booking.find({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] }, // Check against pending or confirmed bookings
      $and: [
        { checkInDate: { $lt: checkOutDate } }, // Existing booking starts before requested checkOutDate
        { checkOutDate: { $gt: checkInDate } }  // Existing booking ends after requested checkInDate
      ]
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Property is no longer available for the selected dates.' },
        { status: 409 } // 409 Conflict indicates a conflict with current state of the resource
      );
    }

    // --- 5. Calculate Total Price on the Server (for security and accuracy) ---
    // Ensure this calculation mirrors the pre-save hook for consistency
    const oneDay = 1000 * 60 * 60 * 24;
    const durationInMs = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(durationInMs / oneDay); // Use Math.ceil to round up if partial day

    if (nights <= 0) {
      return NextResponse.json(
        { success: false, message: 'Booking duration must be at least one night.' },
        { status: 400 }
      );
    }

    const totalPrice = nights * property.price;

    // --- 6. Create the Booking Record ---
    const newBooking: IBooking = await Booking.create({
      property: propertyId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      numberOfGuests: numberOfGuests,
      totalPrice: totalPrice,
      status: 'pending', // Default to pending. Payment integration would change this to 'confirmed'.
      paymentStatus: 'pending', // Default payment status
      guestMessage: guestMessage,
      guestId: guestId,
    });

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully. Pending confirmation/payment.',
    }, { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error('Error creating booking:', error);

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