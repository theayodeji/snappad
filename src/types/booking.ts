// types/booking.ts
import { DateRange } from "react-day-picker";

export interface UseBookingResult {
  isAvailable: boolean | null;
  setIsAvailable: (value: boolean | null) => void;
  checkAvailability: (propertyId: string, dates: DateRange) => Promise<boolean>;
  submitBooking: (bookingDetails: BookingCreateInput) => Promise<any>;
  cancelBooking: (bookingId: string) => Promise<void>;
  resetBookingState: () => void;
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
  };
}

export interface BookingDetails {
  _id: string;
  property: any; // Replace with PropertyDetails if available
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  guestMessage?: string;
  createdAt: string;
  guestId: string;
}

export interface BookingCreateInput {
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  guestMessage?: string;
}
