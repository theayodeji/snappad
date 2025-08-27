import Booking from "@/models/Booking";
import Property from "@/models/Property";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "host") throw new Error("Only hosts allowed.");

  try {
    // First, get all properties for this host
    const hostProperties = await Property.find({ hostId: userId });
    const hostPropertyIds = hostProperties.map((p) => p._id);

    // Then find all bookings for these properties
    const hostBookings = await Booking.aggregate([
      {
        $match: {
          property: { $in: hostPropertyIds },
        },
      },
      // Lookup property details
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      // Lookup guest details
      {
        $lookup: {
          from: "users",
          localField: "guestId",
          foreignField: "_id",
          as: "guest",
        },
      },
      { $unwind: "$guest" },
      // Project only the fields we need
      {
        $project: {
          "property._id": 1,
          "property.title": 1,
          "property.imageUrls": 1,
          "property.price": 1,
          "property.location": 1,
          "guest._id": 1,
          "guest.name": 1,
          "guest.email": 1,
          checkInDate: 1,
          checkOutDate: 1,
          numberOfGuests: 1,
          totalPrice: 1,
          status: 1,
          paymentStatus: 1,
          guestMessage: 1,
          ownerMessage: 1,
        },
      },
    ]);

    return NextResponse.json(
      { success: true, bookings: hostBookings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching bookings:", error.message);
    // Return 401 Unauthorized for authentication-related errors
    if (
      error.message === "Missing or invalid Authorization header." ||
      error.message === "Authentication failed." ||
      error.message === "Invalid token signature." ||
      error.message === "Token expired." ||
      error.message === "Malformed token."
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
  }
}
