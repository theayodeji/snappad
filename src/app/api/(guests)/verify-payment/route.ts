import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { Payment } from "@/models/Payment";
import { verifyAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify user is authenticated
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingId, reference } = await request.json();

    if (!bookingId || !reference) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure both updates succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "confirmed" },
        { new: true, session }
      );

      if (!booking) {
        throw new Error("Booking not found");
      }

      // Update payment status
      const updatedPayment = await Payment.findOneAndUpdate(
        {
          bookingId: new mongoose.Types.ObjectId(bookingId),
          providerReference: reference,
        },
        {
          status: "success",
          updatedAt: new Date(),
        },
        { new: true, session }
      );

      if (!updatedPayment) {
        throw new Error("Payment record not found");
      }

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: "Payment verified and booking confirmed",
        data: {
          booking,
          payment: updatedPayment,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
