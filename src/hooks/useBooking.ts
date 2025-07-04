// src/hooks/useBooking.ts

import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { DateRange } from "react-day-picker";
import { parseAxiosError } from "@/lib/parseAxiosError";
import toast from "react-hot-toast";
import type { UseBookingResult, BookingCreateInput } from '@/types/booking';
import { useAuth } from "@/contexts/AuthContext";

export function useBooking(): UseBookingResult {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const {user} = useAuth();

  const [availability, setAvailability] = useState({
    loading: false,
    error: null as string | null,
  });

  const [booking, setBooking] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const [cancellation, setCancellation] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const checkAvailability = useCallback(async (propertyId: string, dates: DateRange): Promise<boolean> => {
    setAvailability({ loading: true, error: null });
    setIsAvailable(null);

    if (!dates.from || !dates.to || dates.from >= dates.to) {
      setAvailability({ loading: false, error: "Please select both check-in and check-out dates." });
      return false;
    }

    try {
      const response = await axios.get(`/api/properties/${propertyId}/availability`, {
        params: {
          checkInDate: dates.from.toISOString(),
          checkOutDate: dates.to.toISOString(),
        },
      });

      if (response.data.success) {
        setIsAvailable(response.data.data.isAvailable);
        return response.data.data.isAvailable;
      } else {
        setAvailability({ loading: false, error: response.data.message || "Failed to check availability." });
        setIsAvailable(false);
        return false;
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Availability check error:", err);
      }
      setAvailability({ loading: false, error: parseAxiosError(err) });
      setIsAvailable(false);
      return false;
    } finally {
      setAvailability(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const submitBooking = useCallback(async (bookingDetails: BookingCreateInput): Promise<any> => {
    setBooking({ loading: true, error: null, success: false });

    try {
      const response = await axios.post("/api/bookings", {
        propertyId: bookingDetails.propertyId,
        checkInDate: bookingDetails.checkInDate.toISOString(),
        checkOutDate: bookingDetails.checkOutDate.toISOString(),
        numberOfGuests: bookingDetails.numberOfGuests,
        guestMessage: bookingDetails.guestMessage,
        guestId: user?.id,
      });

      if (response.data.success) {
        setBooking({ loading: false, error: null, success: true });
        toast.success("Booking created successfully!");
        return response.data.data;
      } else {
        const message = response.data.message || "Failed to create booking.";
        setBooking({ loading: false, error: message, success: false });
        throw new Error(message);
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Booking submission error:", err);
      }
      const errorMessage = parseAxiosError(err);
      setBooking({ loading: false, error: errorMessage, success: false });
      throw new Error(errorMessage);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    setCancellation({ loading: true, error: null, success: false });
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      setCancellation({ loading: false, error: null, success: true });
      toast.success("Booking cancelled successfully!");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to cancel booking.";
      setCancellation({ loading: false, error: message, success: false });
      toast.error(message);
    }
  }, []);

  const resetBookingState = useCallback(() => {
    setIsAvailable(null);
    setAvailability({ loading: false, error: null });
    setBooking({ loading: false, error: null, success: false });
    setCancellation({ loading: false, error: null, success: false });
  }, []);

  return useMemo(() => ({
    isAvailable,
    setIsAvailable,
    checkAvailability,
    submitBooking,
    cancelBooking,
    resetBookingState,
    availability,
    booking,
    cancellation,
  }), [
    isAvailable,
    setIsAvailable,
    checkAvailability,
    submitBooking,
    cancelBooking,
    resetBookingState,
    availability,
    booking,
    cancellation,
  ]);
}
