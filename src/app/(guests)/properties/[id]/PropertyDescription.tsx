import { Pin } from "lucide-react";

interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="flex-1">
      <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
        <Pin className="inline mr-2" />
        Description
      </h2>
      <p className="text-sm md:text-base text-black dark:text-gray-300 mt-2">
        {description}
      </p>
    </div>
  );
}
