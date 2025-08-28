"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SnappadLoader from "@/components/SnappadLoader";
import { format } from "date-fns";
import { FaBed, FaTimesCircle } from "react-icons/fa";
import { MdDateRange, MdLocationOn } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useGuestBooking";
import PropertyInfo from "../_components/PropertyInfo";
import TripDetailsSummary from "../_components/TripDetailsSummary";
import StatusHeader from "../_components/StatusHeader";
import Link from "next/link";
import { usePayment } from "@/hooks/usePayment";
import toast from "react-hot-toast";

interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

interface PropertyDetails {
  _id: string;
  title: string;
  location: Location;
  imageUrls: string[];
  price: number;
  description?: string;
  propertyType?: string;
}

interface BookingDetails {
  _id: string;
  property: PropertyDetails;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  roomType?: string;
  guestMessage?: string;
  createdAt: string;
  status: string;
}

const BookingPage = () => {
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [PaystackPop, setPaystackPop] = useState<any>(null);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("paystack-inline-ts")
      .then((module) => {
        setPaystackPop(() => module.default);
        setPaystackLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Paystack:", err);
        setPaystackLoaded(false);
      });
  }, []);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { fetchBookingDetails } = useBooking();

  const formatFullAddress = (location: Location) => {
    if (!location) return "N/A";
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
      location.zipCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const { initializeCheckout, verifyPayment } = usePayment();

  const handlePayment = async () => {
    // Check if Paystack is loaded
    if (!paystackLoaded || !PaystackPop) {
      toast.error("Payment system is still loading. Please try again.");
      return;
    }

    if (!booking) {
      toast.error("Booking data not available");
      return;
    }

    try {
      const response = await initializeCheckout({
        bookingId,
        propertyId: booking.property._id,
        amount: booking.totalPrice,
      });

      console.log("Checkout response:", response);
      
      // Create new instance of PaystackPop
      const paymentPopup = new PaystackPop();

      paymentPopup.resumeTransaction({
        accessCode: response.data?.accessCode || "",
        onSuccess: async (transaction: any) => {
          toast.success("Payment successful");

          try {
            const verificationResponse = await verifyPayment({
              bookingId,
              reference: transaction.reference,
            });

            console.log("Payment verification:", verificationResponse);

            if (verificationResponse.success) {
              router.push(`/bookings/${bookingId}?payment=success`);
            } else {
              console.error("Payment verification failed");
              toast.error(
                verificationResponse.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed");
          }
        },
        onError: (error: any) => {
          toast.error(error.message || "Payment failed");
        },
      });
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment");
    }
  };

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID not provided.");
      setLoading(false);
      return;
    }
    if (authLoading) {
      return;
    }

    if (!isAuthenticated && !authLoading) {
      setError("You must be logged in to view this booking.");
      setLoading(false);
      return;
    }
    if (isAuthenticated && !authLoading) {
      setLoading(true);
      setError(null);
      fetchBookingDetails(bookingId).then(
        ({ data, error }: { data: BookingDetails; error: string | null }) => {
          if (data) {
            setBooking(data);
          } else {
            setError(error || "Failed to fetch booking details.");
          }
          setLoading(false);
        }
      );
    }
  }, [bookingId, isAuthenticated, authLoading, fetchBookingDetails]);

  if (loading || authLoading) {
    return (
      <div className="h-[calc(100dvh-64px)] w-full flex items-center justify-center">
        <SnappadLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] p-4 bg-gray-50 dark:bg-neutral-800">
        <div className="bg-black p-8 rounded-xl shadow-xl border border-red-400 dark:border-red-700 max-w-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaTimesCircle className="text-red-500 text-6xl mb-6 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Oops! Something Went Wrong
          </h2>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
            We encountered an issue loading your booking details:
            <br />
            <strong className="text-red-500 dark:text-red-300">{error}</strong>
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            Please ensure you have a stable internet connection and the booking
            ID is correct. If the problem persists, kindly try again later or
            contact our support team.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-64px)] p-4 text-neutral-900 dark:text-neutral-300">
        <h2 className="text-xl font-semibold mb-4">Booking not found.</h2>
        <p>
          It seems the booking you are looking for does not exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-5xl space-y-10">
        <StatusHeader
          status={booking?.status || ""}
          handlePayment={handlePayment}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <img
            src={booking.property.imageUrls?.[0]}
            alt={booking.property.title}
            className="w-full h-72 object-cover rounded-xl shadow-lg"
          />

          <PropertyInfo
            property={booking.property}
            roomType={booking.roomType}
            checkInDate={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            formatFullAddress={formatFullAddress}
          />
        </div>

        <TripDetailsSummary
          details={[
            {
              title: "Total Price",
              value: (
                <span className="text-xl font-bold text-primary">
                  ${booking.totalPrice.toFixed(2)}
                </span>
              ),
              icon: <span className="text-4xl font-bold text-primary">$</span>,
            },
            {
              title: "Room Type",
              value: booking.roomType || "Standard double room",
              icon: <FaBed className="text-4xl text-primary" />,
            },
            {
              title: "Trip Start",
              value: format(new Date(booking.checkInDate), "EEEE, dd MMM yyyy"),
              icon: <MdDateRange className="text-4xl text-primary" />,
            },
          ]}
        />

        <div className="bg-gray-100 dark:bg-neutral-dark rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3 items-start">
            <MdLocationOn className="text-4xl text-primary" />
            <div>
              <h3 className="text-md font-semibold text-primary">Location</h3>
              <p className="text-sm">
                {formatFullAddress(booking.property.location)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;