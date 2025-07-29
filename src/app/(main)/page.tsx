"use client";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import { usePropertyList } from "@/hooks/useProperties";
import SnappadLoader from "@/components/SnappadLoader";

export default function Home() {
  const { properties, loadingProperties, propertiesError } = usePropertyList();

  return (
    <div className="grid grid-rows-[0_1fr_0px] items-center justify-items-center md:min-h-[calc(100dvh-72px)] sm:px-20">
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-6xl">
        {loadingProperties && (
          <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center dark:bg-black">
            <SnappadLoader />
          </div>
        )}
        {propertiesError && (
          <div className="text-primary">{propertiesError}</div>
        )}
        <div className="flex flex-wrap items-stretch justify-center gap-4 mx-auto w-full">
          {properties.length > 0
            ? properties.map((property: any) => (
                <PropertyCard
                  key={property._id}
                  id={property._id}
                  imageUrl={property.imageUrls?.[0] || "/file.svg"}
                  title={property.title}
                  description={property.description}
                  price={property.price}
                  badge="For Rent"
                  ownerEmail={property.ownerContact?.email || "N/A"}
                  ownerPhone={property.ownerContact?.phone || ""}
                />
              ))
            : !loadingProperties && (
                <div className="text-neutral-dark">No properties found.</div>
              )}
        </div>
      </main>
    </div>
  );
}
