import React from "react";
import { X } from "lucide-react";
import MobileDateInputs from "./MobileDateInputs";
import { DateRange } from "react-day-picker";
import MobileGuestInput from "./MobileGuestInput";
import MobileAvailabilityStatus from "./MobileAvailabilityStatus";
import MobileBookingButton from "./MobileBookingButton";

interface MobileBookingModalProps {
  propertyTitle: string;
  propertyPrice: number;
  propertyCapacity: number;
  selectedDates: DateRange;
  setSelectedDates: React.Dispatch<React.SetStateAction<DateRange>>;
  numberOfGuests: number;
  setNumberOfGuests: (n: number) => void;
  nights: number;
  totalBookingPrice: number;
  isAvailable: boolean | null;
  availabilityLoading: boolean;
  submittedBookingLoading: boolean;
  onSubmit: () => void;
  onClose: () => void;
  guestMessage: string;
  setGuestMessage: (msg: string) => void;
}

export default function MobileBookingModal({
  propertyTitle,
  propertyPrice,
  propertyCapacity,
  selectedDates,
  setSelectedDates,
  numberOfGuests,
  setNumberOfGuests,
  nights,
  totalBookingPrice,
  isAvailable,
  availabilityLoading,
  submittedBookingLoading,
  onSubmit,
  onClose,
  guestMessage,
  setGuestMessage,
}: MobileBookingModalProps) {
  return (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[100]">
      <div className="bg-white dark:bg-black rounded-t-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative animate-slideUp border-t-4 border-primary">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-neutral-dark dark:text-white">
            Reserve {propertyTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 text-neutral-dark dark:text-gray-300">
          <MobileDateInputs
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />

          <MobileGuestInput
            numberOfGuests={numberOfGuests}
            setNumberOfGuests={setNumberOfGuests}
            propertyCapacity={propertyCapacity}
          />

          {/* Guest Message */}
          <div>
            <label
              htmlFor="guestMessage"
              className="block text-sm font-medium text-neutral-dark dark:text-gray-300 mb-2"
            >
              Your Message (Optional)
            </label>
            <textarea
              id="guestMessage"
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-dark text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Any special requests or questions?"
            ></textarea>
          </div>

          {/* Pricing Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-dark dark:text-gray-300">
                Nights:
              </span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-dark dark:text-gray-300">
                Price per night:
              </span>
              <span>${propertyPrice}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-neutral-dark dark:text-gray-100">
                Total Price:
              </span>
              <span className="text-primary">
                ${totalBookingPrice.toFixed(2)}
              </span>
            </div>
            <MobileAvailabilityStatus
              isAvailable={isAvailable}
              loading={availabilityLoading}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <MobileBookingButton
              onClick={onSubmit}
              disabled={
                submittedBookingLoading ||
                availabilityLoading ||
                !isAvailable ||
                !selectedDates?.from ||
                !selectedDates?.to ||
                numberOfGuests <= 0
              }
              loading={submittedBookingLoading}
              availabilityLoading={availabilityLoading}
            />
            <button
              onClick={onClose}
              className="w-full bg-secondary hover:bg-tertiary text-neutral-dark dark:text-white font-semibold py-3 rounded-lg transition-colors dark:bg-neutral-dark dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
}
