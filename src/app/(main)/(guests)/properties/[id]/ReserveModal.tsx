// src/app/properties/[id]/ReserveModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation"; // Don't forget to import useRouter!

import { useBooking } from "@/hooks/useGuestBooking";
import type { BookingCreateInput } from '@/types/booking';

// Assuming GuestDropdown and DateInput are correctly defined and imported
import GuestDropdown from "./GuestDropdown";
import DateInput from "./DateInput";
import ButtonLoader from "@/components/ui/ButtonLoader";

export interface ReserveModalProps {
  propertyId: string;
  propertyPrice: number;
  propertyCapacity: number;
  selectedDates: DateRange;
  setSelectedDates: React.Dispatch<React.SetStateAction<DateRange>>;
  numberOfGuests: number;
  setNumberOfGuests: React.Dispatch<React.SetStateAction<number>>;
}

function ReserveModal({
  propertyId,
  propertyPrice,
  propertyCapacity,
  selectedDates,
  setSelectedDates,
  numberOfGuests,
  setNumberOfGuests,
}: ReserveModalProps) {
  const router = useRouter();

  const {
    isAvailable,
    checkAvailability,
    submitBooking,
    resetBookingState,
    availability,
    booking,
    cancellation,
  } = useBooking();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [nights, setNights] = useState(0);
  const [totalBookingPrice, setTotalBookingPrice] = useState(0);

  // Effect to recalculate nights, total price, and trigger availability check
  useEffect(() => {
    resetBookingState();
    if (selectedDates.from && selectedDates.to) {
      const diffTime = Math.abs(
        selectedDates.to.getTime() - selectedDates.from.getTime()
      );
      const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(calculatedNights);
      setTotalBookingPrice(calculatedNights * propertyPrice);
      checkAvailability(propertyId, selectedDates);
    } else {
      setNights(0);
      setTotalBookingPrice(0);
    }
  }, [
    selectedDates,
    propertyPrice,
    propertyId,
    checkAvailability,
    resetBookingState,
  ]);

  // Handle guest count change from the dropdown
  const handleGuestsSelect = (option: number) => {
    setNumberOfGuests(option);
    setDropdownOpen(false);
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (!selectedDates.from || !selectedDates.to || numberOfGuests < 1) {
      alert("Please select valid dates and number of guests.");
      return;
    }
    if (!isAvailable) {
      alert("Property is not available for the selected dates.");
      return;
    }
    if (numberOfGuests > propertyCapacity) {
      alert(
        `Number of guests exceeds property capacity of ${propertyCapacity}.`
      );
      return;
    }

    try {
      const bookingData = await submitBooking({
        propertyId,
        checkInDate: selectedDates.from!,
        checkOutDate: selectedDates.to!,
        numberOfGuests,
      } as BookingCreateInput);

      console.log(bookingData.data)

      router.push(`/bookings/${bookingData.data._id}`); // Navigate to confirmation page
    } catch (err) {
      console.log(err)
      alert(booking.error || "Booking failed. Please try again.");
    }
  };

  const isBookButtonDisabled =
    !selectedDates.from ||
    !selectedDates.to ||
    !isAvailable ||
    availability.loading ||
    booking.loading ||
    numberOfGuests < 1 ||
    numberOfGuests > propertyCapacity;

  return (
    <div className="hidden md:block w-[380px]">
      <div className="w-full p-6 rounded-xl shadow-lg dark:bg-white text-black dark:text-white border border-gray-300">
        <p className="text-primary text-3xl font-bold">
          ${propertyPrice}
          <span className="text-black text-xl font-semibold"> /night</span>
        </p>
        <p className="text-gray-500 text-sm">Select your dates</p>
        <div className="rounded-xl border border-black mt-3">
          <div className="flex items-center border-b border-black">
            <DateInput
              label="CHECK-IN"
              value={selectedDates.from}
              onChange={(from) =>
                setSelectedDates((dates) => ({ ...dates, from }))
              }
            />
            <DateInput
              label="CHECK-OUT"
              value={selectedDates.to}
              onChange={(to) => setSelectedDates((dates) => ({ ...dates, to }))}
            />
          </div>
          <GuestDropdown
            value={numberOfGuests}
            setValue={handleGuestsSelect}
            max={propertyCapacity}
          />
        </div>
        {/* Availability Status Display */}
        {availability.loading && (
          <p className="text-sm text-primary-500 flex items-center gap-1 mt-2 text-black">
            <IoInformationCircleOutline /> Checking availability...
          </p>
        )}
        {availability.error && (
          <p className="text-sm text-red-500 flex items-start gap-1 mt-2">
            <IoInformationCircleOutline className="mt-1" />
            <span>{availability.error}</span>
          </p>
        )}
        {isAvailable !== null &&
          !availability.loading &&
          !availability.error && (
            <p
              className={`text-sm flex items-center gap-1 mt-2 ${
                isAvailable ? "text-green-600" : "text-red-500"
              }`}
            >
              <IoInformationCircleOutline />
              {isAvailable
                ? "Property is available!"
                : "Property is unavailable for these dates."}
            </p>
          )}
        {/* Booking Summary */}
        {nights > 0 && (
          <div className="flex justify-between items-center text-base font-semibold border-t border-neutral-200 pt-4 mt-4 bg-white text-gray-800">
            <span>
              <span className="text-primary">${propertyPrice}</span> x{" "}
              <span className="text-black">{nights}</span> nights
            </span>
            <span className="text-black">${totalBookingPrice}</span>
          </div>
        )}
        {/* Reserve Button */}
        <button
          onClick={handleBookNow}
          disabled={isBookButtonDisabled}
          className={`w-full mt-5 py-3 rounded-lg font-bold text-white transition-colors duration-200
            ${
              isBookButtonDisabled
                ? "bg-neutral-400 cursor-not-allowed"
                : "bg-primary hover:bg-tertiary"
            }`}
        >
          {booking.loading ? <ButtonLoader />: "Reserve"}
        </button>
        <p className="text-neutral-500 text-sm mt-3 text-center">
          You won't be charged yet
        </p>
        {/* Booking Status Feedback */}
        {booking.error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <IoInformationCircleOutline /> {booking.error}
          </p>
        )}
        {booking.success && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <IoInformationCircleOutline /> Booking successful!
          </p>
        )}
        {/* Cancellation Status Feedback (optional, if you add a cancel button) */}
        {cancellation.error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <IoInformationCircleOutline /> {cancellation.error}
          </p>
        )}
        {cancellation.success && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <IoInformationCircleOutline /> Booking cancelled!
          </p>
        )}
      </div>
    </div>
  );
}

export default ReserveModal;
