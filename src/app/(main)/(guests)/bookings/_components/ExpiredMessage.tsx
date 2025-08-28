import React from "react";
import { FaHourglassEnd } from "react-icons/fa";

const ExpiredMessage: React.FC = () => (
  <div className="text-center space-y-4">
    <FaHourglassEnd className="mx-auto text-gray-500 text-6xl" />
    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
      Booking Expired
    </h1>
    <p className="text-base text-gray-600 dark:text-gray-300">
      This booking has expired. Please make a new reservation if you'd like to stay with us.
    </p>
  </div>
);

export default ExpiredMessage;
