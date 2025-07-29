// src/app/api/saved-listings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming your dbConnect utility
import User from '@/models/User'; // Your User Mongoose model
import Property from '@/models/Property'; // Your Property Mongoose model
import { verifyAuth } from '@/lib/auth'; // Your authentication utility

// GET /api/saved-listings
// Retrieves all properties saved by the authenticated user.
export async function GET(request: NextRequest) {
  await dbConnect(); // Connect to the database

  try {
    //Authenticate the request and get the user ID
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; // The ID of the authenticated user
    
    const user = await User.findById(userId).populate({
      path: 'savedProperties',
      model: Property,
      select: '_id title imageUrls price location description',
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: user.savedProperties },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching saved listings:', error.message); // Updated console log

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

// POST /api/saved-listings
// Adds a property to the authenticated user's saved list.
export async function POST(request: NextRequest) {
  await dbConnect(); // Connect to the database

  try {
    //Authenticate the request and get the user ID
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; // The ID of the authenticated user

    const { propertyId } = await request.json();

    // 3. Basic input validation
    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: 'Property ID is required.' },
        { status: 400 }
      );
    }

    // 4. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // 5. Check if the property is already saved (for idempotency)
    // This prevents duplicate entries in the savedProperties array.
    if (user.savedProperties.includes(propertyId)) {
      return NextResponse.json(
        { success: true, message: 'Property is already in your saved list.' },
        { status: 200 } // Return 200 OK because the desired state is already achieved
      );
    }

    // 6. Add the propertyId to the user's savedProperties array
    user.savedProperties.push(propertyId);
    await user.save(); // Save the updated user document

    // 7. Return success response
    return NextResponse.json(
      { success: true, message: 'Property added to saved list successfully.' },
      { status: 201 } // 201 Created indicates a new resource (the saved relationship) was created
    );
  } catch (error: any) {
    // Centralized error handling for authentication and server errors
    console.error('Error adding property to saved listings:', error.message); // Updated console log

    // Handle Mongoose CastError if propertyId is not a valid ObjectId
    if (error.name === 'CastError' && error.path === '_id') {
      return NextResponse.json(
        { success: false, message: 'Invalid Property ID format.' },
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
