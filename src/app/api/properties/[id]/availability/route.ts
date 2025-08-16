import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import Property from '@/models/Property'; 
import Booking, { IBooking } from '@/models/Booking'; 

// GET /api/properties/[id]/availability
// Checks if a property is available for a given date range.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params; // Property ID from the dynamic route segment
  const searchParams = request.nextUrl.searchParams;
  const checkInDateStr = searchParams.get('checkInDate');
  const checkOutDateStr = searchParams.get('checkOutDate');

  // --- 1. Basic Validation ---
  if (!checkInDateStr || !checkOutDateStr) {
    return NextResponse.json(
      { success: false, message: 'Check-in and check-out dates are required.' },
      { status: 400 }
    );
  }

  // Parse dates to Date objects
  const checkInDate = new Date(checkInDateStr);
  const checkOutDate = new Date(checkOutDateStr);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return NextResponse.json(
      { success: false, message: 'Invalid date format.' },
      { status: 400 }
    );
  }

  // Ensure checkOutDate is after checkInDate
  if (checkOutDate <= checkInDate) {
    return NextResponse.json(
      { success: false, message: 'Check-out date must be after check-in date.' },
      { status: 400 }
    );
  }

  try {
    // --- 2. Check if Property Exists ---
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found.' },
        { status: 404 }
      );
    }

    // --- 3. Check for Overlapping Bookings ---
    const overlappingBookings: IBooking[] = await Booking.find({
      property: id,
      status: { $in: ['pending', 'confirmed'] }, // Consider 'pending' bookings as well for availability
      $or: [
        // Scenario 1: Existing booking starts within the requested range
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },
        // Scenario 2: Requested range starts within existing booking (already covered by 1)
        // Scenario 3: Requested range fully contains existing booking (already covered by 1)
        // Scenario 4: Existing booking fully contains requested range (already covered by 1)
      ],
      // A more robust overlap query often looks like this:
      $and: [
        { checkInDate: { $lt: checkOutDate } }, // Existing booking starts before requested checkOutDate
        { checkOutDate: { $gt: checkInDate } }  // Existing booking ends after requested checkInDate
      ]
    });

    const isAvailable = overlappingBookings.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        isAvailable: isAvailable,
        // You might return more details here, e.g., conflicting booking IDs
      },
      message: isAvailable ? 'Property is available.' : 'Property is unavailable for the selected dates.',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}