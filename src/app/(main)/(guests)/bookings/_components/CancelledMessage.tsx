import React from "react";
import { FaTimesCircle } from "react-icons/fa";

const CancelledMessage: React.FC = () => (
  <div className="text-center space-y-4">
    <FaTimesCircle className="mx-auto text-red-500 text-6xl" />
    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
      Booking Cancelled
    </h1>
    <p className="text-base text-gray-600 dark:text-gray-300">
      Your booking has been successfully cancelled. We're sorry to see you go!
    </p>
  </div>
);

export default CancelledMessage;
