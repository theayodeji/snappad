import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ConfirmationMessage: React.FC = () => (
  <div className="text-center space-y-4">
    <FaCheckCircle className="mx-auto text-green-500 text-6xl" />
    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
      Booking Confirmed!
    </h1>
    <p className="text-base text-gray-600 dark:text-gray-300">
      We’ve reserved your stay. A confirmation email has been sent to you.
    </p>
  </div>
);

export default ConfirmationMessage;
