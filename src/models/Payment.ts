// models/Payment.ts
import mongoose, { Schema, model, Document } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "success" | "failed";
  providerReference?: string; // real payment provider reference
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    providerReference: { type: String },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || model<IPayment>("Payment", PaymentSchema);
