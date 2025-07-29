import React from "react";

interface MobileBookingButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  availabilityLoading: boolean;
}

export function MobileBookingButton({
  onClick,
  disabled,
  loading,
  availabilityLoading,
}: MobileBookingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
        ${
          loading || availabilityLoading
            ? "bg-gray-500 text-white cursor-not-allowed"
            : "bg-primary-500 hover:bg-primary-600 text-white"
        }`}
    >
      {loading
        ? "Reserving..."
        : availabilityLoading
        ? "Checking..."
        : "Confirm Reservation"}
    </button>
  );
}

export default MobileBookingButton;
