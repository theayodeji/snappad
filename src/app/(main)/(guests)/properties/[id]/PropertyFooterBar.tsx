import MobileBookingButton from "./MobileBookingButton";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import MobileBookingModal from "./MobileBookingModal";
import { useBooking } from "@/hooks/useBooking"; // Assuming this hook exists
import { useBookingCalculation } from "@/hooks/useBookingCalculation"; // Assuming this hook exists
import { format } from "date-fns";
import { toast } from "react-hot-toast"; // For user feedback

import { ReserveModalProps } from "./ReserveModal"; // Corrected import path based on your input

interface PropertyFooterBarProps extends ReserveModalProps {
  propertyTitle: string; // Keeping this prop as requested
}

export default function PropertyFooterBar({
  propertyId,
  propertyPrice,
  propertyCapacity,
  selectedDates,
  setSelectedDates,
  numberOfGuests,
  setNumberOfGuests,
  propertyTitle, // Destructure propertyTitle
}: PropertyFooterBarProps) {
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [guestMessage, setGuestMessage] = useState(""); // State for guest message

  // Use the booking hook for availability and submission
  const {
    isAvailable,
    checkAvailability,
    submitBooking,
    resetBookingState,
    availability, // This will be 'available', 'unavailable', or 'checking'
    booking: submittedBooking, // Renamed to avoid conflict with local 'booking' state
  } = useBooking();

  // Use the booking calculation hook
  const { nights, totalBookingPrice } = useBookingCalculation({
    propertyId,
    propertyPrice,
    selectedDates,
  });

  // Effect to trigger availability check automatically when dates or guests change
  useEffect(() => {
    resetBookingState();

    // Only check if both dates are selected and guests are valid
    if (selectedDates?.from && selectedDates?.to && numberOfGuests > 0) {
      // Ensure check-out is after check-in before checking availability
      if (selectedDates.to <= selectedDates.from) {
        toast.error("Check-out date must be after check-in date."); // Provide immediate feedback
        return;
      }
      checkAvailability(propertyId, selectedDates);
    }
    // If conditions are not met, resetBookingState() already handled it (by being at the top)
  }, [
    selectedDates,
    numberOfGuests,
    propertyId,
    checkAvailability,
    resetBookingState,
  ]);

  // Effect to handle booking submission success/failure
  useEffect(() => {
    // Corrected check: submittedBooking.success is the correct flag
    if (
      submittedBooking.success &&
      !submittedBooking.loading &&
      !submittedBooking.error
    ) {
      handleCloseModal();
    } else if (submittedBooking.error && !submittedBooking.loading) {
      toast.error(`Booking failed: ${submittedBooking.error}`);
    }
  }, [submittedBooking]); // Dependency on submittedBooking object

  const handleOpenModal = () => {
    setIsReserveModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReserveModalOpen(false);
    resetBookingState(); // Reset booking state when modal closes
    setGuestMessage(""); // Clear guest message on close
  };

  const handleSubmitBooking = async () => {
    if (
      !selectedDates?.from ||
      !selectedDates?.to ||
      numberOfGuests <= 0 ||
      !isAvailable // isAvailable comes from useBooking
    ) {
      toast.error(
        "Please ensure dates are selected, guests are valid, and property is available."
      );
      return;
    }
    // Ensure check-out is after check-in
    if (
      selectedDates.from &&
      selectedDates.to &&
      selectedDates.to <= selectedDates.from
    ) {
      toast.error("Check-out date must be after check-in date.");
      return;
    }
    // Call submitBooking from useBooking hook
    // Ensure submitBooking expects an object as per your API route
    await submitBooking({
      propertyId,
      checkInDate: selectedDates.from,
      checkOutDate: selectedDates.to,
      numberOfGuests,
      guestMessage,
    });
  };

  return (
    <>
      {/* The main footer bar, visible only on mobile (md:hidden) */}
      <div className="md:hidden fixed bottom-4 left-0 w-full flex justify-center z-10">
        <div className="bg-white shadow-lg rounded-xl w-[90%] max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <span className="text-lg md:text-xl font-bold text-primary">
              ${propertyPrice}
              <span className="text-sm font-semibold text-black">/night</span>
            </span>
            <span className="text-sm text-gray-400">10% off this week!</span>
           {isAvailable !== null && <span
              className={`text-xs font-medium ${
                availability.loading  && isAvailable !== null
                  ? "text-blue-500"
                  : isAvailable
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {availability.loading && isAvailable !== null
                ? "Checking availability..."
                : isAvailable
                ? "Property is available!"
                : "Property is not available for these dates."}
            </span>}
          </div>
          <button
            onClick={handleOpenModal}
            className="text-sm bg-primary text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:bg-primary/90 transition"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Reserve Modal (only visible when isReserveModalOpen is true and on mobile) */}
      {isReserveModalOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[100]">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full h-[90vh] overflow-y-auto shadow-xl p-6 relative animate-slideUp">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-neutral-dark dark:text-white">
                Reserve {propertyTitle}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Reservation Form */}
            <MobileBookingModal
              propertyTitle={propertyTitle}
              propertyPrice={propertyPrice}
              propertyCapacity={propertyCapacity}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              numberOfGuests={numberOfGuests}
              setNumberOfGuests={setNumberOfGuests}
              nights={nights}
              totalBookingPrice={totalBookingPrice}
              isAvailable={isAvailable}
              availabilityLoading={availability.loading}
              submittedBookingLoading={submittedBooking.loading}
              onSubmit={handleSubmitBooking}
              onClose={handleCloseModal}
              guestMessage={guestMessage}
              setGuestMessage={setGuestMessage}
            />
          </div>
        </div>
      )}

      {/* CSS for slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
