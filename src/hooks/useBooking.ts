// src/hooks/useBooking.ts

import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { DateRange } from "react-day-picker";
import { parseAxiosError } from "@/lib/parseAxiosError"; // New utility

interface UseBookingResult {
  isAvailable: boolean | null;
  availabilityLoading: boolean;
  availabilityError: string | null;
  bookingLoading: boolean;
  bookingError: string | null;
  bookingSuccess: boolean;
  setIsAvailable: (value: boolean | null) => void;
  checkAvailability: (propertyId: string, dates: DateRange) => Promise<boolean>;
  submitBooking: (bookingDetails: {
    propertyId: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    guestMessage?: string;
  }) => Promise<any>;
  resetBookingState: () => void;
}

export function useBooking(): UseBookingResult {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const checkAvailability = useCallback(
    async (propertyId: string, dates: DateRange): Promise<boolean> => {
      setAvailabilityLoading(true);
      setAvailabilityError(null);
      setIsAvailable(null);

      if (!dates.from || !dates.to ||( dates.from >= dates.to)) {
        setAvailabilityError(
          "Please select both check-in and check-out dates."
        );
        setAvailabilityLoading(false);
        return false;
      }

      try {
        const response = await axios.get(
          `/api/properties/${propertyId}/availability`,
          {
            params: {
              checkInDate: dates.from.toISOString(),
              checkOutDate: dates.to.toISOString(),
            },
          }
        );

        if (response.data.success) {
          setIsAvailable(response.data.data.isAvailable);
          return response.data.data.isAvailable;
        } else {
          setAvailabilityError(
            response.data.message || "Failed to check availability."
          );
          setIsAvailable(false);
          return false;
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Availability check error:", err);
        }
        setAvailabilityError(parseAxiosError(err));
        setIsAvailable(false);
        return false;
      } finally {
        setAvailabilityLoading(false);
      }
    },
    []
  );

  const submitBooking = useCallback(
    async (bookingDetails: {
      propertyId: string;
      checkInDate: Date;
      checkOutDate: Date;
      numberOfGuests: number;
      guestMessage?: string;
    }): Promise<any> => {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(false);

      try {
        const response = await axios.post("/api/bookings", {
          propertyId: bookingDetails.propertyId,
          checkInDate: bookingDetails.checkInDate.toISOString(),
          checkOutDate: bookingDetails.checkOutDate.toISOString(),
          numberOfGuests: bookingDetails.numberOfGuests,
          guestMessage: bookingDetails.guestMessage,
        });

        if (response.data.success) {
          setBookingSuccess(true);
          return response.data.data;
        } else {
          setBookingError(response.data.message || "Failed to create booking.");
          setBookingSuccess(false);
          throw new Error(response.data.message || "Failed to create booking.");
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Booking submission error:", err);
        }
        const errorMessage = parseAxiosError(err);
        setBookingError(errorMessage);
        setBookingSuccess(false);
        throw new Error(errorMessage);
      } finally {
        setBookingLoading(false);
      }
    },
    []
  );

  const resetBookingState = useCallback(() => {
    setIsAvailable(null);
    setAvailabilityLoading(false);
    setAvailabilityError(null);
    setBookingLoading(false);
    setBookingError(null);
    setBookingSuccess(false);
  }, []);

  return useMemo(
    () => ({
      isAvailable,
      availabilityLoading,
      availabilityError,
      bookingLoading,
      bookingError,
      bookingSuccess,
      setIsAvailable,
      checkAvailability,
      submitBooking,
      resetBookingState,
    }),
    [
      isAvailable,
      availabilityLoading,
      availabilityError,
      bookingLoading,
      bookingError,
      bookingSuccess,
      setIsAvailable,
      checkAvailability,
      submitBooking,
      resetBookingState,
    ]
  );
}
