import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect(); // Connect to the database

  try {
    // 1. Authenticate the request and get the user ID
    const decodedToken = await verifyAuth(request);
    const userId = decodedToken.id; // The ID of the authenticated user

    // 2. Get the propertyId from the dynamic route parameters
    const { id: propertyId } = await params;

    // 3. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    const initialSavedCount = user.savedProperties.length;
    user.savedProperties.pull(propertyId);
    await user.save(); // Save the updated user document

    // 5. Check if anything was actually removed (optional, but good for logging/debugging)
    if (user.savedProperties.length === initialSavedCount) {
      // If the count hasn't changed, it means the propertyId wasn't in the array.
      // We still return 204 No Content for idempotency, as the desired state (not saved) is achieved.
      return NextResponse.json(
        { success: true, message: 'Property was not in saved list or already removed.' },
        { status: 200 } // 200 No Content
      );
    }

    // 6. Return success response
    return NextResponse.json(
      { success: true, message: 'Property removed from saved list successfully.' },
      { status: 204 } // 204 No Content
    );
  } catch (error: any) {
    console.error('Error removing property from saved listings:', error.message);

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