import React from "react";
import { format } from "date-fns";

interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

interface PropertyDetails {
  _id: string;
  title: string;
  location: Location;
  imageUrls: string[];
  price: number;
  description?: string;
}

interface PropertyInfoProps {
  property: PropertyDetails;
  roomType?: string;
  checkInDate: string;
  checkOutDate: string;
  formatFullAddress: (location: Location) => string;
}

const PropertyInfo: React.FC<PropertyInfoProps> = ({
  property,
  roomType,
  checkInDate,
  checkOutDate,
  formatFullAddress,
}) => (
  <div className="bg-secondary dark:bg-neutral-dark p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow">
    <h2 className="text-2xl font-semibold text-primary mb-1">
      {property.title}
    </h2>
    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
      <p>
        <strong>Room:</strong> {roomType || "Standard double room"}
      </p>
      <p>
        <strong>Check-in:</strong> {format(new Date(checkInDate), "EEEE, dd MMM yyyy")} (after 3PM)
      </p>
      <p>
        <strong>Check-out:</strong> {format(new Date(checkOutDate), "EEEE, dd MMM yyyy")} (before 11AM)
      </p>
      <p>
        <strong>Location:</strong> {formatFullAddress(property.location)}
      </p>
    </div>
  </div>
);

export default PropertyInfo;
