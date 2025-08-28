import Link from "next/link";
import React from "react";
import { FaTimesCircle } from "react-icons/fa";

interface ErrorMessageProps {
  error: string;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-64px)] p-6 bg-gradient-to-br from-primary/10 via-white to-primary/10">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-red-400 dark:border-red-700 max-w-lg w-full text-center animate-fade-in">
        <FaTimesCircle className="text-red-500 text-6xl mb-6 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Oops! Something Went Wrong</h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
          We encountered an issue loading your booking details:
          <br /><strong className="text-red-500 dark:text-red-300">{error}</strong>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Please ensure you have a stable internet connection and the booking ID is correct.
          If the problem persists, kindly try again later or contact our support team.
        </p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorMessage;
