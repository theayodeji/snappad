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
    <div className="flex items-end justify-center text-6xl md:text-8xl font-semibold select-none">
      {letters.map((l, i) => (
        <span
          key={i}
          className={`inline-block ${l.color} animate-snappad-wiggle`}
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {l.char}
        </span>
      ))}
      <style jsx>{`
        @keyframes snappad-wiggle {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          20% {
            transform: translateY(-30%) rotate(-5deg) scale(1.2);
          }
          40% {
            transform: translateY(5%) rotate(5deg) scale(0.95);
          }
          60% {
            transform: translateY(-15%) rotate(-3deg) scale(1.05);
          }
          80% {
            transform: translateY(3%) rotate(2deg) scale(0.98);
          }
        }
        .animate-snappad-wiggle {
          animation: snappad-wiggle 1.8s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

export default SnappadLoader;
