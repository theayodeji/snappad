import React from "react";
import { formatDateForInput } from "@/lib/dateUtils";

export interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

function DateInput({ label, value, onChange }: DateInputProps) {
  return (
    <div className="flex-1 p-2 w-full h-full">
      <p className="text-gray-500 text-sm">{label}</p>
      <input
        type="date"
        className="w-full text-sm bg-transparent text-black focus:outline-none"
        value={formatDateForInput(value)}
        onChange={e => {
          const val = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
          onChange(val);
        }}
      />
    </div>
  );
}

export default DateInput;
