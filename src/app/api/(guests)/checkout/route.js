// app/api/payments/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Payment } from "@/models/Payment";
import User from "@/models/User";
import Paystack from "@paystack/paystack-sdk";
import { verifyAuth } from "@/lib/auth";

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

export async function POST(req) {
  try {
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.id;
    await dbConnect();

    const { bookingId, propertyId, amount } = await req.json();

    // Fetch user email from database
    const user = await User.findById(userId).select("email role").lean();
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "guest") {
      throw new Error("User is not a guest");
    }

    if (!bookingId || !propertyId || !amount) {
      throw new Error(
        "Missing required booking details (propertyId, dates, guests)."
      );
    }
      
    // Initialize Paystack payment
    const paymentData = {
      
      email: user.email, // Use email from database
      amount: amount * 100,
      reference: `PAYSTACK_${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}?payment=success`,
      metadata: {
        bookingId,
        guestId: userId,
        propertyId,
      },
    };

    // Initialize Paystack transaction
    const response = await paystack.transaction.initialize(paymentData);

    if (!response.status) {
      throw new Error("Failed to initialize payment");
    }

    const existingPayment = await Payment.findOne({bookingId});

    // Create payment record
    if (!existingPayment) {
    await Payment.create({
      bookingId,
      guestId: userId,
      property: propertyId,
      amount,
      status: "pending",
      providerReference: paymentData.reference,
    });
  }else{
    existingPayment.providerReference = paymentData.reference;
    await existingPayment.save();
  }

    return NextResponse.json({
      status: "success",
      data: {
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
        reference: response.data.reference,
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
    const statusCode = error.statusCode || 400;
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Payment processing failed",
        code: error.code,
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "error", message: "Method not allowed" },
    { status: 405 }
  );
}
