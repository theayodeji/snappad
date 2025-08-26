"use client";
import PropertyCard from "@/components/PropertyCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePropertyList } from "@/hooks/useProperties";
import { Property } from "@/types/property";
import SnappadLoader from "@/components/SnappadLoader";
import Hero from "./_components/Hero";
import FeaturesSection from "./_components/FeaturesSection";
import { useEffect } from "react";

export default function Home() {
  const { properties, loadingProperties, propertiesError } = usePropertyList();
  const { user } = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (user && user.role === "host") {
      navigate.push("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="grid grid-rows-[0_1fr_0px] items-center justify-items-center md:min-h-[calc(100dvh-72px)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-6xl">
        {loadingProperties && (
          <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center dark:bg-black">
            <SnappadLoader />
          </div>
        )}
        {propertiesError && (
          <div className="text-black dark:text-white">{propertiesError}</div>
        )}
        <Hero />
        <FeaturesSection />
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Explore New Properties
          </h2>

          <div className="flex flex-wrap items-stretch justify-between gap-4 mx-auto">
            {properties.length > 0
              ? properties.map((property: Property) => (
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
                  <div className="text-black dark:text-white">No properties found.</div>
                )}
          </div>
        </div>
      </main>
    </div>
  );
}
