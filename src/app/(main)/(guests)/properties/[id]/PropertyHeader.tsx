import { Heart, Share, Star } from "lucide-react";

interface PropertyHeaderProps {
  title: string;
  rating: number;
}

export default function PropertyHeader({ title, rating }: PropertyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="w-[80%] text-xl md:text-2xl lg:text-3xl font-semibold text-black dark:text-white">
        {title}  <span className="text-base"><Star size={21} className="inline pb-1 outline-white" /> {rating || '4.0'}</span>
      </h1>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-black dark:bg-white p-2 rounded-3xl md:px-3 md:rounded-xl">
          <Share size={16} className="text-white dark:text-black" />
          <span className="hidden md:block text-white dark:text-black">Share</span>
        </button>
        <button className=" flex items-center gap-2 bg-primary text-white p-2 rounded-3xl md:px-3 md:rounded-xl">
          <Heart size={16} />
          <span className="hidden md:block">Save</span>
        </button>
      </div>
    </div>
  );
}
