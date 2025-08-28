// src/hooks/useBooking.ts
import { useState, useCallback, useMemo } from "react";
import axios from "@/lib/api";
import { DateRange } from "react-day-picker";
import { parseAxiosError } from "@/lib/parseAxiosError";
import toast from "react-hot-toast";
import type { UseBookingResult, BookingCreateInput, BookingDetails } from "@/types/booking";
import { useAuth } from "@/contexts/AuthContext";

export function useBooking(): UseBookingResult {
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Get user and auth status
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const [availability, setAvailability] = useState({
    loading: false,
    error: null as string | null,
  });

  const [booking, setBooking] = useState({
    // This state is for the *submission* process
    loading: false,
    error: null as string | null,
    success: false,
    data: null as any | null, // Added 'data' to store the successful booking data
  });

  const [cancellation, setCancellation] = useState({
    loading: false,
    error: null as string | null,
    success: false,
    bookingId: null as string | null, // Added 'bookingId' to track which booking is being cancelled
  });

  const checkAvailability = useCallback(
    async (propertyId: string, dates: DateRange): Promise<boolean> => {
      setAvailability({ loading: true, error: null });
      setIsAvailable(null);

      if (!dates.from || !dates.to || dates.from >= dates.to) {
        setAvailability({
          loading: false,
          error: "Please select both check-in and check-out dates.",
        });
        return false;
      }

      try {
        const response = await axios.get(
          `/properties/${propertyId}/availability`,
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
          setAvailability({
            loading: false,
            error: response.data.message || "Failed to check availability.",
          });
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
        setAvailability((prev) => ({ ...prev, loading: false }));
      }
    },
    []
  );

  const submitBooking = useCallback(
    async (bookingDetails: BookingCreateInput): Promise<{ data: BookingDetails; error: string | null }> => {
      setBooking({ loading: true, error: null, success: false, data: null }); // Reset data on new submission

      if (!isAuthenticated || !user?.id) {
        const errorMessage = "You must be logged in to create a booking.";
        setBooking({
          loading: false,
          error: errorMessage,
          success: false,
          data: null,
        });
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      try {
        const response = await axios.post("/bookings", {
          propertyId: bookingDetails.propertyId,
          checkInDate: bookingDetails.checkInDate.toISOString(),
          checkOutDate: bookingDetails.checkOutDate.toISOString(),
          numberOfGuests: bookingDetails.numberOfGuests,
          guestMessage: bookingDetails.guestMessage,
          guestId: user.id,
        });

        if (response.data.success) {
          setBooking({
            loading: false,
            error: null,
            success: true,
            data: response.data.data,
          });
          toast.success("Booking created successfully!");
          return response.data;
        } else {
          const message = response.data.message || "Failed to create booking.";
          setBooking({
            loading: false,
            error: message,
            success: false,
            data: null,
          });
          throw new Error(message);
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Booking submission error:", err);
        }
        const errorMessage = parseAxiosError(err);
        setBooking({
          loading: false,
          error: errorMessage,
          success: false,
          data: null,
        });
        throw new Error(errorMessage);
      }
    },
    [isAuthenticated, user?.id]
  );

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      setCancellation({
        loading: true,
        error: null,
        success: false,
        bookingId,
      });

      if (!isAuthenticated || !user?.id) {
        const errorMessage = "You must be logged in to cancel a booking.";
        setCancellation({
          loading: false,
          error: errorMessage,
          success: false,
          bookingId: null,
        });
        toast.error(errorMessage);
        return;
      }

      try {
        const response = await axios.delete(`/bookings/${bookingId}`);
        if (response.data.success || response.status === 204) {
          setCancellation({
            loading: false,
            error: null,
            success: true,
            bookingId,
          });
          toast.success("Booking cancelled successfully!");
        } else {
          const message = response.data.message || "Failed to cancel booking.";
          setCancellation({
            loading: false,
            error: message,
            success: false,
            bookingId: null,
          });
          toast.error(message);
        }
      } catch (error: any) {
        const message = parseAxiosError(error) || "Failed to cancel booking.";
        setCancellation({
          loading: false,
          error: message,
          success: false,
          bookingId: null,
        });
        toast.error(message);
      }
    },
    [isAuthenticated, user?.id]
  );

  const fetchUserBookings = useCallback(async (): Promise<{
    data: BookingDetails[];
    error: string | null;
  }> => {
    if (!isAuthenticated || !user?.id || authLoading) {
      return {
        data: [],
        error: "Authentication required to fetch bookings.",
      };
    }

    try {
      const response = await axios.get("/bookings");
      if (response.data.success) {
        return { data: response.data.data as BookingDetails[], error: null };
      } else {
        return {
          data: [],
          error: response.data.message || "Failed to fetch user bookings.",
        };
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching user bookings:", err);
      }
      return { data: [], error: parseAxiosError(err) };
    }
  }, [isAuthenticated, user?.id, authLoading]);

  const fetchBookingDetails = useCallback(
    async (bookingId: string): Promise<{ data: any; error: string | null }> => {
      if (!isAuthenticated || !user?.id || authLoading) {
        return {
          data: null,
          error: "Authentication required to fetch booking details.",
        };
      }
      try {
        const response = await axios.get(`/bookings/${bookingId}`);
        if (response.data.success) {
          return { data: response.data.data, error: null };
        } else {
          return {
            data: null,
            error: response.data.message || "Failed to fetch booking details.",
          };
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching booking details:", err);
        }
        return { data: null, error: parseAxiosError(err) };
      }
    },
    [isAuthenticated, user?.id, authLoading]
  );

  const resetBookingState = useCallback(() => {
    setIsAvailable(null);
    setAvailability({ loading: false, error: null });
    setBooking({ loading: false, error: null, success: false, data: null });
    setCancellation({
      loading: false,
      error: null,
      success: false,
      bookingId: null,
    });
  }, []);

  return useMemo(
    () => ({
      isAvailable,
      setIsAvailable,
      checkAvailability,
      submitBooking,
      cancelBooking,
      resetBookingState,
      availability,
      booking,
      cancellation,
      fetchBookingDetails,
      fetchUserBookings,
    }),
    [
      isAvailable,
      setIsAvailable,
      checkAvailability,
      submitBooking,
      cancelBooking,
      resetBookingState,
      availability,
      booking,
      cancellation,
      fetchBookingDetails,
      fetchUserBookings,
    ]
  );
}
