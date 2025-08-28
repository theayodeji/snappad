import { useAuth } from "@/contexts/AuthContext";
import { useHostBookings } from "@/hooks/useHostBooking";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaExclamation } from "react-icons/fa";

const UpcomingBooking = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading, error } = useHostBookings(user?.id);
  
  // Safely access the first booking
  const nextBooking = bookings?.[0];
  
  // Format check-in date in words if it exists
  const formatDateInWords = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formattedDate = nextBooking?.checkInDate 
    ? formatDateInWords(nextBooking.checkInDate)
    : null;

  if (authLoading || isLoading) {
    return (
      <div className="space-y-4 p-6 flex items-center justify-between dark:bg-neutral-800 bg-white rounded-lg shadow">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <img src="/occupied.png" alt="occupied" className="hidden lg:block w-48 md:w-72" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 py-10 dark:bg-neutral-800 bg-white rounded-lg shadow flex justify-between items-center gap-2 mb-4">
        <div>
          <FaExclamation className="text-red-500 text-4xl" />
          <div className="text-3xl font-semibold">Error loading bookings.</div>
        </div>
      </div>
    );
  }

  if (!nextBooking) {
    return (
      <div className="p-8 py-10 dark:bg-neutral-800 bg-white rounded-lg shadow flex justify-between items-center gap-2 mb-4">
        <div>
          <div className="text-3xl font-semibold">No upcoming bookings.</div>
          <a href="#view-history" className="text-primary text-lg hover:underline">
            View Performance/History
            <ArrowUpRight size={16} className="inline" />
          </a>
        </div>
        <img src="/vacant.png" alt="vacant" className="w-48 md:w-72 hidden lg:block" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-6 dark:bg-neutral-800 bg-white rounded-lg shadow">
      <div className="flex flex-col gap-2 items-start">
        <div className="text-base sm:text-lg md:text-xl">
          <span className="font-semibold">Next Booking:</span>
          <span className="ml-2">
            {nextBooking.property?.title || "N/A"},
          </span>
          {formattedDate && (
            <span className="block"> {formattedDate}</span>
          )}
        </div>
        <div className="text-sm sm:text-md md:text-lg">
          <span className="font-semibold">Guest Name:</span>
          <span className="ml-2">
            {nextBooking.guest?.name || "N/A"}
          </span>
        </div>
        <a href={`mailto:${nextBooking.guest?.email || ""}`} className="text-primary hover:underline text-sm sm:text-base md:text-lg">
          Contact Guest <ArrowUpRight size={16} className="inline" />
        </a>
      </div>
      <img src="/occupied.png" alt="occupied" className="hidden lg:block w-48 md:w-72" />
    </div>
  );
}

export default UpcomingBooking