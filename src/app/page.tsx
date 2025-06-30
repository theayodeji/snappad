"use client";
import Image from "next/image";
import PropertyCard from "./(guests)/properties/PropertyCard";
import { usePropertyList } from "../hooks/useProperties";
import SnappadLoader from "@/components/SnappadLoader";

export default function Home() {
  const { properties, loading, error } = usePropertyList();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        {loading && (
          <div className="h-[100dvh] w-full flex items-center justify-center">
            <SnappadLoader />
          </div>
        )}
        {error && <div className="text-primary">{error}</div>}
        <div className="flex flex-wrap items-stretch justify-start gap-4 w-full mx-auto">
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
            : !loading && (
                <div className="text-neutral-dark">No properties found.</div>
              )}
        </div>
      </main>
    </div>
  );
}
