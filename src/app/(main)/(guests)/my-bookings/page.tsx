// src/app/bookings/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Bed, Calendar, Clock, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict
import { format, differenceInDays } from 'date-fns';
import SnappadLoader from '@/components/SnappadLoader';
import { useBooking } from '@/hooks/useGuestBooking'; // Import useBooking hook
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { MdLocationOn } from 'react-icons/md'; // Import MdLocationOn

// Define Location interface (assuming it's consistent across your models)
interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

// Define PropertyDetails interface (as expected from populated booking)
interface PropertyDetails {
  _id: string;
  title: string;
  location: Location;
  imageUrls: string[];
  price: number;
}

// Define BookingDetails interface (as returned by /api/bookings GET)
interface BookingDetails {
  _id: string;
  property: PropertyDetails;
  checkInDate: string; 
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // Add more statuses as needed
  paymentStatus: 'pending' | 'paid' | 'refunded'; 
  createdAt: string;
}


const MyBookingsPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth(); 
  const {
    fetchUserBookings, 
    cancelBooking,
    cancellation, 
  } = useBooking();

  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to fetch bookings when component mounts or auth state changes
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadBookings = async () => {
      setLoadingBookings(true);
      setError(null);
      try {
        const { data, error: fetchError } = await fetchUserBookings(); // Call the actual fetch function
        if (fetchError) {
          setError(fetchError);
          toast.error(`Failed to load bookings: ${fetchError}`);
        } else {
          setBookings(data || []);
        }
      } catch (err: any) {
        console.error("Error loading bookings:", err);
        setError("Failed to load bookings. Please try again.");
        toast.error("Failed to load bookings. Please try again.");
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [isAuthenticated, authLoading, router, fetchUserBookings]); // Dependencies include auth states and fetch function

  // Effect to handle cancellation success/error
  useEffect(() => {
    if (cancellation.success) {
      toast.success('Booking cancelled successfully!');
      setBookings(prev =>
        prev.map(booking =>
          booking._id === cancellation.bookingId
            ? { ...booking, status: 'cancelled', paymentStatus: 'refunded' }
            : booking
        )
      );
    } else if (cancellation.error) {
      toast.error(`Cancellation failed: ${cancellation.error}`);
    }
  }, [cancellation]);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      await cancelBooking(bookingId);
    }
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  // Show loader if either bookings are loading or authentication is still being checked
  if (loadingBookings || authLoading) {
    return (
      <div className="h-[calc(100dvh-64px)] w-full flex items-center justify-center">
        <SnappadLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 dark:text-red-400">
        <h2 className="text-2xl font-bold mb-4">Error Loading Bookings</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-400">
        <h2 className="text-2xl font-bold mb-4">No Bookings Found</h2>
        <p>It looks like you haven't made any bookings yet.</p>
        <button onClick={() => router.push('/')} className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg">
          Explore Properties
        </button>
      </div>
    );
  }

  return (
    <div className='w-[90%] mx-auto my-10 max-w-5xl mb-32'>
      <h1 className='lg:text-3xl md:text-2xl text-xl font-bold mb-4 text-neutral-900 dark:text-white'>My Bookings</h1>
      <p className='text-gray-500 dark:text-gray-400 mb-4'>View and manage your past and upcoming bookings.</p>

      <hr className='my-6 border-gray-300 dark:border-gray-700'/>

      <div className="grid grid-cols-1 gap-6">
        {bookings.map((bookingItem) => {
          const checkIn = new Date(bookingItem.checkInDate);
          const checkOut = new Date(bookingItem.checkOutDate);
          const nights = differenceInDays(checkOut, checkIn);
          const isUpcoming = checkIn > new Date();
          const isCancelled = bookingItem.status === 'cancelled';

          return (
            <div key={bookingItem._id} className="flex flex-col md:flex-row bg-white dark:bg-neutral-dark rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Property Image */}
              <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                <img
                  className='w-full h-full object-cover'
                  src={bookingItem.property.imageUrls?.[0] || 'https://placehold.co/400x300/e0e0e0/000000?text=No+Image'}
                  alt={bookingItem.property.title}
                />
              </div>

              {/* Booking Details */}
              <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 className='text-xl font-semibold text-neutral-900 dark:text-white mb-2'>{bookingItem.property.title}</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
                    <MdLocationOn size={16} className="inline-block mr-1 text-primary-500" />
                    {bookingItem.property.location?.city}, {bookingItem.property.location?.country}
                  </p>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4'>
                    <p className='flex items-center gap-2'>
                      <Calendar size={16} className="text-primary-500" />
                      Check-in: {format(checkIn, 'MMM dd, yyyy')}
                    </p>
                    <p className='flex items-center gap-2'>
                      <Calendar size={16} className="text-primary-500" />
                      Check-out: {format(checkOut, 'MMM dd, yyyy')}
                    </p>
                    <p className='flex items-center gap-2'>
                      <UserIcon size={16} className="text-primary-500" />
                      {bookingItem.numberOfGuests} Guests
                    </p>
                    <p className='flex items-center gap-2'>
                      <Bed size={16} className="text-primary-500" />
                      {nights} Nights
                    </p>
                    <p className='flex items-center gap-2'>
                      <Clock size={16} className="text-primary-500" />
                      Booked: {format(new Date(bookingItem.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Price and Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                  <p className='text-lg font-bold text-primary-600 dark:text-primary-400'>
                    Total: ${bookingItem.totalPrice.toFixed(2)}
                  </p>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0
                    ${isCancelled ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      isUpcoming ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {bookingItem.status.toUpperCase()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => handleViewDetails(bookingItem._id)}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    View Details
                  </button>
                  {isUpcoming && !isCancelled && (
                    <button
                      onClick={() => handleCancelBooking(bookingItem._id)}
                      disabled={cancellation.loading} // Correctly uses cancellation.bookingId
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellation.loading ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookingsPage;
