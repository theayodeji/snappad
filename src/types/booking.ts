// types/booking.ts
import { DateRange } from "react-day-picker";

export interface UseBookingResult {
  isAvailable: boolean | null;
  setIsAvailable: (value: boolean | null) => void;
  checkAvailability: (propertyId: string, dates: DateRange) => Promise<boolean>;
  submitBooking: (bookingDetails: BookingCreateInput) => Promise<{ data: BookingDetails; error: string | null }>;
  cancelBooking: (bookingId: string) => Promise<void>;
  resetBookingState: () => void;
  fetchBookingDetails: (bookingId: string) => Promise<{ data: BookingDetails; error: string | null }>;
  fetchUserBookings: () => Promise<{ data: BookingDetails[]; error: string | null }>;
  
  availability: {
    loading: boolean;
    error: string | null;
  };
  booking: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  cancellation: {
    loading: boolean;
    error: string | null;
    success: boolean;
    bookingId: string | null;
  };
}

import { Property } from './property';

export interface BookingDetails {
  _id: string;
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  guestMessage?: string;
  createdAt: string;
}

export interface BookingCreateInput {
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  guestMessage?: string;
}
