import React, { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface GuestDropdownProps {
  value: number;
  setValue: (val: number) => void;
  max: number;
}

function GuestDropdown({ value, setValue, max }: GuestDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative p-3" ref={dropdownRef}>
      <p className="text-gray-500 text-sm">GUESTS</p>
      <button
        type="button"
        className="w-full flex justify-between items-center rounded-lg text-black focus:outline-none"
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          {value} {value === 1 ? "guest" : "guests"}
        </span>
        <ChevronDown
          className={`ml-2 w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {open && (
        <ul className="absolute z-1000 left-0 right-0 mt-2 bg-white dark:bg-dark border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-thin">
          {(() => {
            const items = [];
            for (let option = 1; option <= max; option++) {
              items.push(
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-white ${
                    value === option ? "bg-primary text-white" : "text-black"
                  }`}
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                >
                  {option} {option === 1 ? "guest" : "guests"}
                </li>
              );
            }
            return items;
          })()}
        </ul>
      )}
    </div>
  );
}

export default GuestDropdown;
