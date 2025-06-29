interface PropertyFooterBarProps {
  price: number;
}

export default function PropertyFooterBar({ price }: PropertyFooterBarProps) {
  return (
    <div className="md:hidden fixed bottom-4 left-0 w-full flex justify-center z-50">
      <div className="bg-white shadow-lg rounded-xl w-[90%] max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex flex-col justify-center">
          <span className="text-lg md:text-xl font-bold text-primary">
            ${price}
            <span className="text-sm font-semibold text-black">/night</span>
          </span>
          <span className="text-sm text-gray-400">10% off this week!</span>
        </div>
        <button className="text-sm bg-primary text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:bg-primary/90 transition">
          Reserve
        </button>
      </div>
    </div>
  );
}
