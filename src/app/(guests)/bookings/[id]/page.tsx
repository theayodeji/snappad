// src/app/bookings/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SnappadLoader from '@/components/SnappadLoader'; // Your loader component
import { parseAxiosError } from '@/lib/parseAxiosError'; // Your error parsing utility
import { format } from 'date-fns';

// Import icons needed for the new layout
import { FaCheckCircle, FaBed, FaTimesCircle } from 'react-icons/fa';
import { MdDateRange, MdLocationOn } from 'react-icons/md';

// Define the Location interface as per your last instruction
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
  description?: string; // Added optional description for "3-star hotel..." text
  // Add other property fields like 'starRating' if available
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
      setError('Booking ID not provided.');
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
          setError(response.data.message || 'Failed to fetch booking details.');
        }
      } catch (err: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching booking details:', err);
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
    if (!location) return 'N/A';
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
      location.zipCode,
    ].filter(Boolean); // Filter out any undefined/null parts
    return parts.join(', ');
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
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Oops! Something Went Wrong</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            We encountered an issue loading your booking details:
            <br /><strong className="text-red-500 dark:text-red-300">{error}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Please ensure you have a stable internet connection and the booking ID is correct.
            If the problem persists, kindly try again later or contact our support team.
          </p>
          <a href="/" className="inline-block mt-6 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300">
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
        <p>It seems the booking you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-black flex justify-center items-start pt-10 md:pt-8 pb-8">
      {/* Main white container mimicking the image's structure */}
      <div className="w-full max-w-5xl bg-white dark:bg-black  p-6 md:p-8">

        {/* Top Section: Property Summary & Confirmation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8 md:mb-10">
          {/* Left: Property Summary Card */}
          <div className="flex-shrink-0 w-full md:w-1/2 lg:w-[450px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
            {/* Property Image */}
            {booking.property.imageUrls && booking.property.imageUrls.length > 0 && (
              <img
                src={booking.property.imageUrls[0]}
                alt={booking.property.title}
                className="w-full h-56 object-cover rounded-md mb-4"
              />
            )}
            {/* Property Title & Stars */}
            <h3 className="text-xl font-bold text-primary dark:text-gray-100 mb-1">
              {booking.property.title} *** {/* Hardcoded stars as per image, adjust if you have a starRating prop */}
            </h3>
            {/* Check-in/Check-out Dates */}
            <div className="text-gray-700 dark:text-gray-200 text-sm">
              <p><span className="font-semibold">Check-in:</span> {format(new Date(booking.checkInDate), 'EEEE, dd MMMM yyyy')}</p>
              <p><span className="font-semibold">Check-out:</span> {format(new Date(booking.checkOutDate), 'EEEE, dd MMMM yyyy')}</p>
            </div>
            {/* Room Type */}
            <p className="text-gray-700 dark:text-gray-200 text-sm mt-3">
              {booking.roomType || "Standard double room"} {/* Use dynamic roomType if available, else hardcode */}
            </p>
          </div>

          {/* Right: Confirmation Message */}
          <div className="flex-grow flex flex-col items-center justify-center p-4 my-auto">
            <FaCheckCircle className="text-green-500 text-7xl md:text-8xl mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-gray-100 text-center">Your booking is now confirmed!</h2>
          </div>
        </div>

        {/* Bottom Section: Detailed Trip Information Card */}
        <div className="w-full p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
          {/* Prominent Trip Start Date */}
          <h3 className="text-xl md:text-2xl font-semibold text-primary dark:text-gray-100 mb-6">
            Your trip starts {format(new Date(booking.checkInDate), 'EEEE, dd MMMM yyyy')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-gray-700 dark:text-gray-200">
            {/* Check-in Details */}
            <div className="flex items-start gap-3">
              <MdDateRange className="text-2xl text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary dark:text-gray-100">Check-in</p>
                <p>{format(new Date(booking.checkInDate), 'EEEE, dd MMMM yyyy')}, from 3 PM</p> {/* Hardcoded time */}
              </div>
            </div>
            {/* Check-out Details */}
            <div className="flex items-start gap-3">
              <MdDateRange className="text-2xl text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary dark:text-gray-100">Check-out</p>
                <p>{format(new Date(booking.checkOutDate), 'EEEE, dd MMMM yyyy')}, until 11 AM</p> {/* Hardcoded time */}
              </div>
            </div>
            {/* Details (Address) */}
            <div className="flex items-start gap-3 col-span-full"> {/* Spans full width */}
              <MdLocationOn className="text-2xl text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary dark:text-gray-100">Location</p>
                <p>{formatFullAddress(booking.property.location)}</p>
              </div>
            </div>
            {/* Room Type Details */}
            <div className="flex items-start gap-3">
              <FaBed className="text-2xl text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary dark:text-gray-100">Room Type</p>
                <p>{booking.roomType || "Standard double room"}</p>
              </div>
            </div>
            {/* Total Price Details */}
            <div className="flex items-start gap-3">
              <span className="text-2xl text-primary-500 font-bold flex-shrink-0 mt-0.5">$</span>
              <div>
                <p className="font-semibold text-primary dark:text-gray-100">Total Price</p>
                <p className="text-lg font-bold text-primary dark:text-white">${booking.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmationPage;