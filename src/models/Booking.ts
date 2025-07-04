// models/Booking.ts

import mongoose, { Document, Schema } from 'mongoose';
import Property from './Property'; // Import the Property model

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId; // Optional field for guest ID
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'declined';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentIntentId?: string;
  ownerMessage?: string;
  guestMessage?: string;
}

const BookingSchema: Schema<IBooking> = new mongoose.Schema<IBooking>(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true, // Optional field for guest ID
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date.',
      },
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: [1, 'At least one guest is required.'],
      max: [5, 'Maximum of 5 guests allowed.'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'declined'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentIntentId: String,
    ownerMessage: String,
    guestMessage: String,
  },
  { timestamps: true }
);

BookingSchema.index({ property: 1, checkInDate: 1, checkOutDate: 1 });

/**
 * Pre-save middleware to auto-calculate total price.
 */
BookingSchema.pre('validate', async function (next) {
  const booking = this as IBooking;

  if (!booking.checkInDate || !booking.checkOutDate || !booking.property) {
    return next();
  }

  const property = await Property.findById(booking.property);
  if (!property) {
    return next(new Error('Property not found'));
  }

  const nights =
    (booking.checkOutDate.getTime() - booking.checkInDate.getTime()) /
    (1000 * 60 * 60 * 24);

  booking.totalPrice = Math.ceil(nights) * property.price;

  next();
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
