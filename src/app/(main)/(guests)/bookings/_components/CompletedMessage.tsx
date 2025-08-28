import React from "react";
import { FaClipboardCheck } from "react-icons/fa";

const CompletedMessage: React.FC = () => (
  <div className="text-center space-y-4">
    <FaClipboardCheck className="mx-auto text-green-500 text-6xl" />
    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
      Stay Completed!
    </h1>
    <p className="text-base text-gray-600 dark:text-gray-300">
      We hope you enjoyed your stay! We'd love to see you again soon.
    </p>
  </div>
);

export default CompletedMessage;
