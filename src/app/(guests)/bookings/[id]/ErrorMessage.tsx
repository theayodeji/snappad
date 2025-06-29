import React from "react";
import { FaTimesCircle } from "react-icons/fa";

interface ErrorMessageProps {
  error: string;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] p-4 bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-red-400 dark:border-red-700 max-w-md text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <FaTimesCircle className="text-red-500 text-6xl mb-6 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Oops! Something Went Wrong</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          We encountered an issue loading your booking details:
          <br /><strong className="text-red-500 dark:text-red-300">{error}</strong>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Please ensure you have a stable internet connection and the booking ID is correct.
          If the problem persists, kindly try again later or contact our support team.
        </p>
        <a href="/" className="inline-block mt-6 px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300">
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default ErrorMessage;
