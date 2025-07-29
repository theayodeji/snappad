// src/app/properties/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPropertyById } from "../../../../../lib/fetchPropertyById";
import SnappadLoader from "@/components/SnappadLoader";
import PropertyHeader from "./PropertyHeader";
import PropertyImage from "./PropertyImage";
import PropertyDescription from "./PropertyDescription";
import PropertyLocation from "./PropertyLocation";
import PropertyFeatures from "./PropertyFeatures";
import OwnerContactCard from "./OwnerContactCard";
import PropertyFooterBar from "./PropertyFooterBar";
import ReserveModal from "./ReserveModal";
import DatePicker from "./DatePicker";
import { DateRange } from "react-day-picker";

const DEFAULT_LOCATION = "Lekki, Banana Island, Lagos, Nigeria";

const PropertyDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // --- NEW STATE FOR NUMBER OF GUESTS ---
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchPropertyById(id)
      .then((data: any) => {
        setProperty(data);
      })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center">
        <SnappadLoader />
      </div>
    );

  if (error) return <div className="text-red-500">{error}</div>;
  if (!property) return <div className="">Property not found.</div>;

  return (
    <div className="w-[90%] mx-auto my-10 max-w-5xl mb-32">
      <PropertyHeader
        title={property.title}
        rating={property.rating}
        propertyId={id}
      />
      <PropertyImage
        src={property.imageUrls?.[0] || "/file.svg"}
        alt={property.title}
      />
      <div className="mt-5 md:mt-8 flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4 w-full flex-1">
          <PropertyDescription description={property.description} />
          <PropertyLocation location={property.location || DEFAULT_LOCATION} />
          {property.amenities && property.amenities.length > 0 && (
            <PropertyFeatures features={property.amenities} />
          )}

          {/* --- OWNER CONTACT CARD MOVED FOR BETTER LAYOUT --- */}
          <OwnerContactCard
            phone={property.ownerContact?.phone}
            email={property.ownerContact?.email}
          />
          <DatePicker selectedDates={selected} setSelectedDates={setSelected} />
        </div>

        {/* --- RESERVE MODAL WITH ALL REQUIRED PROPS --- */}
        <ReserveModal
          propertyId={id}
          propertyPrice={property.price}
          propertyCapacity={property.capacity}
          selectedDates={selected}
          setSelectedDates={setSelected}
          numberOfGuests={numberOfGuests}
          setNumberOfGuests={setNumberOfGuests}
        />
      </div>
      <PropertyFooterBar
        propertyId={id}
        propertyTitle={property.title}
        propertyPrice={property.price}
        propertyCapacity={property.capacity}
        selectedDates={selected}
        setSelectedDates={setSelected}
        numberOfGuests={numberOfGuests}
        setNumberOfGuests={setNumberOfGuests}
      />
    </div>
  );
};

export default PropertyDetailsPage;
