import React from "react";
import Link from "next/link";

interface PromoSectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

const PromoSection: React.FC<PromoSectionProps> = ({
  title,
  description,
  ctaText,
  ctaHref,
  className = "",
}) => {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="bg-primary dark:bg-primary rounded-2xl p-8 md:p-12 flex items-center justify-between">
          <div className="md:max-w-[50%] text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-white/90 mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ctaHref}>
                <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-medium transition-colors">
                  {ctaText}
                </button>
              </Link>
              <Link href="/properties">
                <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-6 py-3 rounded-lg text-lg font-medium transition-colors">
                  Browse Properties
                </button>
              </Link>
            </div>
          </div>
          <div className="w-[40%] aspect-square bg-center bg-no-repeat bg-[length:120%_120%]">
            <img src="/house.webp" alt="house" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
