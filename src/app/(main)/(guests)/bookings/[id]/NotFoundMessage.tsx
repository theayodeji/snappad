import React from "react";
import { FaRegSadTear } from "react-icons/fa";

function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-64px)] p-6 bg-gradient-to-br from-primary/10 via-white to-primary/10">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-primary max-w-lg w-full text-center animate-fade-in">
        <FaRegSadTear className="text-primary text-6xl mb-6 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold text-primary mb-3">Booking Not Found</h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
          The booking you are looking for does not exist or has been removed.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-300"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default NotFoundMessage;
