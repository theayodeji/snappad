// src/app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Property from '@/models/Property'; 
import Booking, { IBooking } from '@/models/Booking'; 
import { verifyAuth } from '@/lib/auth'; 

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id;

    const {
      propertyId,
      checkInDate: checkInDateStr,
      checkOutDate: checkOutDateStr,
      numberOfGuests,
      guestMessage
    } = await request.json();

    // --- 1. Basic Input Validation ---
    if (!propertyId || !checkInDateStr || !checkOutDateStr || !numberOfGuests) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking details (propertyId, dates, guests).' },
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
    if (property.capacity && numberOfGuests > property.capacity) {
        return NextResponse.json(
            { success: false, message: `Number of guests exceeds property capacity of ${property.capacity}.` },
            { status: 400 }
        );
    }

    // --- 4. CRITICAL: Re-check Availability to Prevent Race Conditions ---
    const overlappingBookings: IBooking[] = await Booking.find({
      property: propertyId,
      status: { $in: ['pending', 'confirmed'] },
      $and: [
        { checkInDate: { $lt: checkOutDate } },
        { checkOutDate: { $gt: checkInDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Property is no longer available for the selected dates.' },
        { status: 409 }
      );
    }

    // --- 5. Calculate Total Price on the Server (for security and accuracy) ---
    const oneDay = 1000 * 60 * 60 * 24;
    const durationInMs = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(durationInMs / oneDay);

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
      status: 'pending',
      paymentStatus: 'pending',
      guestMessage: guestMessage,
      guestId: userId,
    });

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking created successfully. Pending confirmation/payment.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating booking:', error.message);
    if (error.name === 'CastError' && error.path === '_id') {
      return NextResponse.json(
        { success: false, message: 'Invalid ID format provided.' },
        { status: 400 }
      );
    }
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

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; 

    const bookings = await Booking.find({ guestId: userId }).populate({ 
      path: 'property',
      model: Property,
      select: '_id title imageUrls price location', 
    });

    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
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
