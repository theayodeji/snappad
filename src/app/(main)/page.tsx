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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertySlider from "./_components/PropertySlider";
import PromoSection from "@/components/PromoSection";

export default function Home() {
  const { properties, loadingProperties, propertiesError } = usePropertyList();
  const { user } = useAuth();
  const navigate = useRouter();

  useEffect(() => {
    if (user && user.role === "host") {
      navigate.push("/dashboard");
    }
  }, [user, navigate]);

  if (loadingProperties) {
    return (
      <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center dark:bg-black">
        <SnappadLoader />
      </div>
    );
  }

  if (propertiesError) {
    return (
      <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center dark:bg-black">
        <div className="text-black dark:text-white">{propertiesError}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[0_1fr_0px] items-center justify-items-center md:min-h-[calc(100dvh-72px)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start w-full max-w-6xl">
        <Hero />
        <FeaturesSection />
        <div className="w-[90%] max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Explore New Properties
          </h2>

          <div className="mx-auto max-w-xl md:max-w-3xl lg:max-w-5xl relative">
            {properties.length > 0 ? (
              <PropertySlider properties={properties} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  No properties available at the moment.
                </p>
              </div>
            )}
          </div>
          <PromoSection
            title="Ready to find your perfect home?"
            description="Join thousands of satisfied tenants who found their dream home with us. List your property or find your next rental today!"
            ctaText="List Your Property"
            ctaHref="/host/properties/new"
            className="mt-16"
          />
        </div>
      </main>
    </div>
  );
}
