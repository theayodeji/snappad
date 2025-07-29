import React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface MobileDateInputsProps {
  selectedDates: DateRange;
  setSelectedDates: React.Dispatch<React.SetStateAction<DateRange>>;
}

export default function MobileDateInputs({ selectedDates, setSelectedDates }: MobileDateInputsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-base dark:text-gray-300 mb-2">
        Dates
      </label>
      <div className="flex space-x-2">
        <input
          type="date"
          className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
          value={selectedDates?.from ? format(selectedDates.from, "yyyy-MM-dd") : ""}
          onChange={e =>
            setSelectedDates(prev => ({
              ...prev,
              from: e.target.value ? new Date(e.target.value) : undefined,
            }))
          }
        />
        <input
          type="date"
          className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
          value={selectedDates?.to ? format(selectedDates.to, "yyyy-MM-dd") : ""}
          onChange={e =>
            setSelectedDates(prev => ({
              ...prev,
              to: e.target.value ? new Date(e.target.value) : undefined,
            }))
          }
        />
      </div>
    </div>
  );
}
