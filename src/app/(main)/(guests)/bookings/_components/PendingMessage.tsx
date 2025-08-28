import React, { useEffect } from "react";
import { FaClock } from "react-icons/fa";

const PendingMessage: React.FC<{handlePayment: () => void}> = ({handlePayment}) => {

  return (
  <div className="text-center space-y-4">
    <FaClock className="mx-auto text-yellow-500 text-6xl animate-pulse" />
    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
      Booking Pending
    </h1>
    <p className="text-base text-gray-600 dark:text-gray-300">
      Your booking is being processed. Please proceed to payment.
    </p>
    <button onClick={handlePayment} className="inline-block mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300">
      Proceed to Payment
    </button>
  </div>
);
};

export default PendingMessage;
