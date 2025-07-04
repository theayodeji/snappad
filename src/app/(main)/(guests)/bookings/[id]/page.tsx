// src/app/bookings/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import SnappadLoader from "@/components/SnappadLoader"; // Your loader component
import { parseAxiosError } from "@/lib/parseAxiosError"; // Your error parsing utility
import { format } from "date-fns";
import { FaCheckCircle, FaBed, FaTimesCircle } from "react-icons/fa";
import { MdDateRange, MdLocationOn } from "react-icons/md";
import PropertyInfo from "./PropertyInfo";
import TripDetailsSummary from "./TripDetailsSummary";
import ConfirmationMessage from "./ConfirmationMessage";

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
}

interface BookingDetails {
  _id: string;
  property: PropertyDetails;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  roomType?: string; // Added optional roomType
  guestMessage?: string;
  createdAt: string;
}

const BookingConfirmationPage = () => {
  const params = useParams();
  const bookingId = params?.id as string;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID not provided.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        if (response.data.success) {
          setBooking(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch booking details.");
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching booking details:", err);
        }
        setError(parseAxiosError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Helper to format the full address
  const formatFullAddress = (location: Location) => {
    if (!location) return "N/A";
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
      location.zipCode,
    ].filter(Boolean); // Filter out any undefined/null parts
    return parts.join(", ");
  };

  if (loading) {
    return (
      <div className="h-[calc(100dvh-64px)] w-full flex items-center justify-center">
        <SnappadLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] p-4 bg-gray-50 dark:bg-gray-800">
        <div className="bg-black p-8 rounded-xl shadow-xl border border-red-400 dark:border-red-700 max-w-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <FaTimesCircle className="text-red-500 text-6xl mb-6 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Oops! Something Went Wrong
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            We encountered an issue loading your booking details:
            <br />
            <strong className="text-red-500 dark:text-red-300">{error}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Please ensure you have a stable internet connection and the booking
            ID is correct. If the problem persists, kindly try again later or
            contact our support team.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-64px)] p-4 text-neutral-600">
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
        {/* ✅ Confirmation Message */}
        <ConfirmationMessage />

        {/* 🏠 Property Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <img
            src={booking.property.imageUrls?.[0]}
            alt={booking.property.title}
            className="w-full h-72 object-cover rounded-xl shadow-lg"
          />

          {/* Property Info */}
          <PropertyInfo
            property={booking.property}
            roomType={booking.roomType}
            checkInDate={booking.checkInDate}
            checkOutDate={booking.checkOutDate}
            formatFullAddress={formatFullAddress}
          />
        </div>

        {/* 📋 Trip Details Summary */}
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

        {/* 🗺️ Address Box */}
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

export default BookingConfirmationPage;
