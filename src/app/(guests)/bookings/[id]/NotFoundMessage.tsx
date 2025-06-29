import React from "react";

function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-64px)] p-4 text-neutral-600">
      <h2 className="text-xl font-semibold mb-4">Booking not found.</h2>
      <p>It seems the booking you are looking for does not exist or has been removed.</p>
    </div>
  );
}

export default NotFoundMessage;
