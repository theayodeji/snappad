import React from "react";
import Rating from "./Rating";
import OwnerContact from "./OwnerContact";
import Link from "next/link";

export interface PropertyCardProps {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string | number;
  badge?: string;
  rating?: number;
  ownerEmail: string;
  ownerPhone: string;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  imageUrl,
  title,
  description,
  price,
  badge,
  footerLeft,
  id,
  ownerEmail,
  ownerPhone,
  footerRight,
}) => (
  <Link
    href={`/properties/${id}`}
    className="flex flex-col w-full md:w-[33%] lg:w-[30%] h:auto md:h-[450px] rounded-lg border-1 hover:scale-[1.02] border-gray-200 dark:border-none bg-white dark:bg-dark relative overflow-hidden transition-scale duration-300 ease-out"
  >
    <span className="absolute text-[10px] md:text-xs font-semibold bg-primary text-white uppercase top-4 left-4 md:right-4 md:left-auto px-3 py-1.5 rounded-full">
      {badge}
    </span>
    <div className="flex flex-row md:flex-col items-stretch md:items-center h-[180px] md:h-auto">
      <img
        src={imageUrl}
        alt={title}
        className="w-1/2 h-full md:h-[160px] md:w-full object-cover flex-shrink-0 "
      />
      <div className="flex flex-col flex-1 justify-center md:justify-between p-4 h-full w-full">
        <div className="text-base md:text-2xl font-semibold text-primary">
          ${price}
          <span className="text-sm text-neutral-dark">/Night</span>
        </div>
        <p className="text-md md:text-2xl font-semibold text-black dark:text-black mb-1">
          {title}
        </p>
        <div className="text-sm text-neutral-dark mb-2 line-clamp-2">
          {description.length > 60 ? `${description.slice(0, 60)}...` : description}
        </div>
          <Rating value={4} className="py-2" />
      </div>
    </div>
        <div className="md:border-t border-neutral-200 md:p-2 mt-auto">
          <OwnerContact email={ownerEmail} phone={ownerPhone} />
        </div>
  </Link>
);

export default PropertyCard;
