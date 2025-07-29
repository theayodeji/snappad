import React from "react";

interface MobileGuestInputProps {
  numberOfGuests: number;
  setNumberOfGuests: (n: number) => void;
  propertyCapacity: number;
}

export default function MobileGuestInput({ numberOfGuests, setNumberOfGuests, propertyCapacity }: MobileGuestInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-base dark:text-gray-300 mb-2">
        Number of Guests (Max: {propertyCapacity})
      </label>
      <input
        type="number"
        min="1"
        max={propertyCapacity}
        value={numberOfGuests === 0 ? "" : numberOfGuests}
        onChange={e => {
          const val = e.target.value;
          const num = parseInt(val, 10);
          if (val === "") {
            setNumberOfGuests(0);
          } else if (!isNaN(num)) {
            setNumberOfGuests(Math.max(1, Math.min(propertyCapacity, num)));
          }
        }}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
      />
    </div>
  );
}
