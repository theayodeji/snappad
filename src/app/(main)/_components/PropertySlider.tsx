import React from "react";
import Slider from "react-slick";
import PropertyCard, { PropertyCardProps } from "@/components/PropertyCard";
import { Property } from "@/types/property";

interface PropertySliderProps {
  properties: Property[];
}

const PropertySlider: React.FC<PropertySliderProps> = ({ properties }) => {
  const settings = {
    centerMode: false,
    infinite: false,
    centerPadding: '0',
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2.2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1.8, slidesToScroll: 1 },
      },
    ],
    arrows: true,
    swipeToSlide: true,
    focusOnSelect: false,
  };

  return (
    <div className="w-full mx-auto">
      {/* <div className="relative"> */}
        <Slider {...settings} className="w-auto">
          {properties.map((property) => {
            const { _id, imageUrls, title, description, price, ownerContact } = property;
            return (
              <div key={_id} className="px-2 outline-none">
                <PropertyCard
                  id={_id}
                  imageUrl={imageUrls?.[0] || "/file.svg"}
                  title={title}
                  description={description}
                  price={price}
                  badge="For Rent"
                  ownerEmail={ownerContact?.email || "N/A"}
                  ownerPhone={ownerContact?.phone || ""}
                />
              </div>
            );
          })}
        </Slider>
      {/* </div> */}
    </div>
  );
};

export default PropertySlider;
