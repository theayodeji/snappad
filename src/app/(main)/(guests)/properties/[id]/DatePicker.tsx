import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface Props {
  selectedDates: DateRange;
  setSelectedDates: React.Dispatch<React.SetStateAction<DateRange>>;
}

const DatePicker = ({ selectedDates, setSelectedDates }: Props) => {
  return (
    <div className="w-max">
      <DayPicker
        animate
        mode="range"
        required
        selected={selectedDates}
        onSelect={setSelectedDates}
        disabled={{ from: new Date(2024, 12, 30), to: new Date() }}
        classNames={{
          caption: "text-lg font-bold text-black",
          day: "rounded-full border-none md:p-2 cursor-pointer",
          today: "text-primary",
          selected: "border-2 border-primary text-black",
          range_start: "bg-primary text-white",
          range_end: "bg-primary text-white",
          range_middle: "text-white bg-tertiary",
          chevron: "fill-tertiary",
        }}
        footer={
          selectedDates.from && selectedDates.to ? (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
              {`Selected date: ${selectedDates.from?.toLocaleDateString()} - ${selectedDates.to?.toLocaleDateString()}`}
            </p>
          ) : (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
              Please select a date.
            </p>
          )
        }
      />
    </div>
  );
};

export default DatePicker;
