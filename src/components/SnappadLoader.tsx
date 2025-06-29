import React from "react";

const letters = [
  { char: "S", color: "text-black dark:text-white" },
  { char: "n", color: "text-black dark:text-white" },
  { char: "a", color: "text-black dark:text-white" },
  { char: "p", color: "text-black dark:text-white" },
  { char: "p", color: "text-primary" },
  { char: "a", color: "text-primary" },
  { char: "d", color: "text-primary" },
];

function SnappadLoader() {
  return (
    <div className="flex items-end justify-center text-6xl md:text-8xl font-semibold select-none ">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`inline-block ${l.color} animate-snappad-bounce`}
          style={{ animationDelay: `${i * 0.3}s` }}
        >
          {l.char}
        </span>
      ))}
      <style jsx>{`
        @keyframes snappad-bounce {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-40%); }
          40% { transform: translateY(0); }
        }
        .animate-snappad-bounce {
          animation: snappad-bounce 2s cubic-bezier(0,.56,.85,.92) infinite;
        }
      `}</style>
    </div>
  );
}

export default SnappadLoader;
