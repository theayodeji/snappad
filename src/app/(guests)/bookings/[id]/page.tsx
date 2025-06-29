// src/app/bookings/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SnappadLoader from '@/components/SnappadLoader';
import { parseAxiosError } from '@/lib/parseAxiosError';
import { format } from 'date-fns';
import ErrorMessage from './ErrorMessage';
import NotFoundMessage from './NotFoundMessage';

// Define the Location interface based on your new information
interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string; // zipCode might be optional
}

// Update PropertyDetails to use the new Location interface
interface PropertyDetails {
  _id: string;
  title: string;
  location: Location;
  imageUrls: string[];
  price: number;
  // Add other property fields you might want to display
}

interface BookingDetails {
  _id: string;
  property: PropertyDetails;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  guestMessage?: string;
  createdAt: string;
  // Add other booking fields you might want to display (e.g., status, payment info)
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

  if (loading) {
    return (
      <div className="h-[calc(100dvh-64px)] w-full flex items-center justify-center">
        <SnappadLoader />
      </div>
    );
  }

  // --- STYLED ERROR MESSAGE ---
  if (error) {
    return <ErrorMessage error={error} />;
  }
  // --- END STYLED ERROR MESSAGE ---

  if (!booking) {
    return <NotFoundMessage />;
  }

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

  return (
    <div className="w-[90%] mx-auto my-10 max-w-3xl mb-32 bg-card-bg p-8 rounded-lg shadow-xl border border-card-border">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 text-center">
        Booking Confirmed!
      </h1>
      <p className="text-lg text-neutral-700 mb-8 text-center">
        Thank you for your reservation at <span className="font-semibold">{booking.property.title}</span>!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-text-base mb-3 border-b pb-2">Booking Details</h2>
          <p className="mb-2"><strong className="text-neutral-700">Booking ID:</strong> <span className="break-all">{booking._id}</span></p>
          <p className="mb-2"><strong className="text-neutral-700">Check-in Date:</strong> {format(new Date(booking.checkInDate), 'PPPP')}</p>
          <p className="mb-2"><strong className="text-neutral-700">Check-out Date:</strong> {format(new Date(booking.checkOutDate), 'PPPP')}</p>
          <p className="mb-2"><strong className="text-neutral-700">Number of Guests:</strong> {booking.numberOfGuests}</p>
          {booking.guestMessage && (
            <p className="mb-2"><strong className="text-neutral-700">Your Message:</strong> {booking.guestMessage}</p>
          )}
          <p className="mb-2"><strong className="text-neutral-700">Total Price:</strong> <span className="text-primary-500 font-bold text-xl">${booking.totalPrice}</span></p>
          <p className="mb-2 text-sm text-neutral-500">Booked On: {format(new Date(booking.createdAt), 'PPPP p')}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-base mb-3 border-b pb-2">Property Details</h2>
          <p className="mb-2"><strong className="text-neutral-700">Property:</strong> {booking.property.title}</p>
          <p className="mb-2"><strong className="text-neutral-700">Location:</strong> {formatFullAddress(booking.property.location)}</p>
          {booking.property.imageUrls && booking.property.imageUrls.length > 0 && (
            <div className="mt-4">
              <img
                src={booking.property.imageUrls[0]}
                alt={booking.property.title}
                className="w-full h-48 object-cover rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-neutral-600 mb-4">
          A confirmation email with all details has been sent to your registered email address.
        </p>
        <a href="/" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;