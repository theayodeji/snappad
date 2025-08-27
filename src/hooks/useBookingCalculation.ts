import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useBooking } from "./useGuestBooking";


interface UseBookingCalculationOptions {
  propertyId: string;
  propertyPrice: number;
  selectedDates: DateRange;
}

export function useBookingCalculation({
  propertyId,
  propertyPrice,
  selectedDates,
}: UseBookingCalculationOptions) {
  const [nights, setNights] = useState(0);
  const [totalBookingPrice, setTotalBookingPrice] = useState(0);
  const { checkAvailability, resetBookingState } = useBooking();

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
  }, [selectedDates, propertyPrice, propertyId, checkAvailability, resetBookingState]);

  return { nights, totalBookingPrice };
}
