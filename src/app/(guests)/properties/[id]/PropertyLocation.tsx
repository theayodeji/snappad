import { MapPinned } from "lucide-react";

interface PropertyLocationProps {
  location: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export default function PropertyLocation({ location }: PropertyLocationProps) {
  const { address, city, state, zipCode, country } = location;
  return (
    <div className="flex-1">
      <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
        <MapPinned className="inline mr-2" />
        Location
      </h2>
      <p className="text-sm md:text-base text-black dark:text-gray-300 mt-2">
        {[address, city, state, country].filter(Boolean).join(", ")}
      </p>
      <p>
        {zipCode && <span className="text-sm md:text-base text-black dark:text-gray-300 mt-2">Zip Code: {zipCode}</span>}
      </p>
    </div>
  );
}
