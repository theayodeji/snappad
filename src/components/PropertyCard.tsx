import React from "react";
import Rating from "./Rating";
import OwnerContact from "./OwnerContact";
import Link from "next/link";

export interface PropertyCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string | number;
  badge?: string;
  rating?: number;
  ownerEmail: string;
  ownerPhone: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  imageUrl,
  title,
  description,
  price,
  badge,
  ownerEmail,
  ownerPhone,
  rating = 0,
}) => {
  return (
    <Link
      href={`/properties/${id}`}
      className="group block w-full max-w-xs mx-auto rounded-xl overflow-hidden shadow-lg bg-white dark:bg-neutral-dark hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-40 md:h-44 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-tertiary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description.length > 80 ? description.slice(0, 80) + "..." : description}
          </p>
        </div>
        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div>
              <span className="text-primary font-semibold text-lg md:text-xl">${price}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/Night</span>
            </div>
          </div>
          <Rating value={rating} />
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 hidden md:block">
        <OwnerContact email={ownerEmail} phone={ownerPhone} />
      </div>
    </Link>
  );
};

export default PropertyCard;
