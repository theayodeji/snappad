"use client";

import React from "react";
import DashboardGreeting from "../_components/DashboardGreeting";

type Listing = {
  id: string;
  title: string;
  location: string;
  isOccupied: boolean;
  imageUrl: string;
  occupantName?: string;
};

const dummyListings: Listing[] = [
  {
    id: "1",
    title: "Cozy Beach House",
    location: "Lagos, Nigeria",
    isOccupied: true,
    occupantName: "Chuka O.",
    imageUrl: "https://source.unsplash.com/random/300x200?house",
  },
  {
    id: "2",
    title: "Modern Apartment",
    location: "Abuja, Nigeria",
    isOccupied: false,
    imageUrl: "https://source.unsplash.com/random/300x200?apartment",
  },
  {
    id: "3",
    title: "Luxury Villa",
    location: "Ibadan, Nigeria",
    isOccupied: true,
    occupantName: "Jane D.",
    imageUrl: "https://source.unsplash.com/random/300x200?villa",
  },
];

const HostDashboard: React.FC = () => {
  const totalListings = dummyListings.length;
  const currentOccupants = dummyListings.filter((l) => l.isOccupied).length;

  return (
    <div className="p-6 space-y-6">
      <DashboardGreeting />

      {/* Stats */}
      <div className="">
        
      </div> 

      {/* Recent Listings */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
          Recent Listings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dummyListings.slice(0, 3).map((listing) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden"
            >
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
                  {listing.title}
                </h3>
                <p className="text-sm text-neutral-500">{listing.location}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {listing.isOccupied
                    ? `Occupied by ${listing.occupantName}`
                    : "Currently Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardStat = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-neutral-700 dark:text-white">
      {label}
    </h3>
    <p className="text-3xl mt-2 text-primary font-bold">{value}</p>
  </div>
);

export default HostDashboard;
