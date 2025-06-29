interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  return (
    <div className="mt-5">
      <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
        What this place offers
      </h2>
      <ul className="list-disc list-inside text-sm md:text-base text-black dark:text-gray-300 mt-2">
        {features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
