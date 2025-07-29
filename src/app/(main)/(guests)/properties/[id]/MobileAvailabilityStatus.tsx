import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface MobileAvailabilityStatusProps {
  isAvailable: boolean | null;
  loading: boolean;
}

export function MobileAvailabilityStatus({ isAvailable, loading }: MobileAvailabilityStatusProps) {
  return (
    isAvailable !== null && (
      <div className="flex items-center gap-2 mt-4 text-sm font-medium">
        {loading ? (
          <span className="animate-spin text-blue-500">⚪</span>
        ) : isAvailable ? (
          <CheckCircle size={18} className="text-green-500" />
        ) : (
          <XCircle size={18} className="text-red-500" />
        )}
        <span
          className={
            loading
              ? "text-blue-600"
              : isAvailable
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {loading
            ? "Checking availability..."
            : isAvailable
            ? "Available!"
            : "Not available for these dates."}
        </span>
      </div>
    )
  );
}

export default MobileAvailabilityStatus;
