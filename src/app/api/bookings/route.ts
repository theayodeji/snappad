// src/app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property'; 
import Booking, { IBooking } from '@/models/Booking'; 
import { verifyAuth } from '@/lib/auth'; 

// POST /api/bookings
// Creates a new booking.
export async function POST(request: NextRequest) {
  await dbConnect(); // Connect to your database

  try {
    // Protect this route: Verify the token and get the user payload
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; // Get the user ID from the decoded token

    const {
      propertyId,
      checkInDate: checkInDateStr,
      checkOutDate: checkOutDateStr,
      numberOfGuests,
      guestMessage
      // guestId is now derived from the authenticated user, not from the request body
    } = await request.json();

    // --- 1. Basic Input Validation ---
    if (!propertyId || !checkInDateStr || !checkOutDateStr || !numberOfGuests) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking details (propertyId, dates, guests).' },
        { status: 400 }
      );
    }

    // No need to validate guestId from body, as it's now from the token

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
    // Assuming 'capacity' is a field on your Property model
    if (property.capacity && numberOfGuests > property.capacity) {
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
        { checkOutDate: { $gt: checkInDate } }  // Existing booking ends after requested checkInDate
      ]
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Property is no longer available for the selected dates.' },
        { status: 409 } // 409 Conflict indicates a conflict with current state of the resource
      );
    }

    // --- 5. Calculate Total Price on the Server (for security and accuracy) ---
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
      guestId: userId, // Use the authenticated userId from the token
    });

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully. Pending confirmation/payment.',
    }, { status: 201 }); // 201 Created

  } catch (error: any) {
    // This catch block will now handle authentication errors as well (from verifyAuth)
    console.error('Error creating booking:', error.message);
    if (error.name === 'CastError' && error.path === '_id') {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format provided.' },
        { status: 400 }
      );
    }
    // Return 401 Unauthorized for authentication-related errors
    if (error.message === 'Missing or invalid Authorization header.' || 
        error.message === 'Authentication failed.' ||
        error.message === 'Invalid token signature.' ||
        error.message === 'Token expired.' ||
        error.message === 'Malformed token.') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    // Generic server error for other issues
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/bookings
// Allows an authenticated user to retrieve their own bookings.
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Protect this route: Verify the token and get the user payload
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; // Get the user ID from the decoded token

    // Find all bookings associated with the authenticated user
    // Populate the 'property' field to get property details
    const bookings = await Booking.find({ guestId: userId }).populate({ // Changed 'user' to 'guestId' for consistency
      path: 'property',
      model: Property,
      select: '_id title imageUrls price location', // Select relevant property fields
    });

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error: any) {
    // This catch block will now handle authentication errors as well
    console.error('Error fetching bookings:', error.message);
    // Return 401 Unauthorized for authentication-related errors
    if (error.message === 'Missing or invalid Authorization header.' || 
        error.message === 'Authentication failed.' ||
        error.message === 'Invalid token signature.' ||
        error.message === 'Token expired.' ||
        error.message === 'Malformed token.') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}
