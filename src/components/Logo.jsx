import React from 'react';

export function Logo({ variant = "full", size = "normal", className = "" }) {
  const heightClasses = {
    small:  "h-10 sm:h-12",
    normal: "h-14 sm:h-16 max-h-18",
    large:  "h-16 sm:h-20",
    xlarge: "h-24 sm:h-28"
  };

  return (
    <div className={`flex items-center cursor-pointer select-none group ${className}`}>
      <img
        src="/logo.jpeg?v=2"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/logo.png?v=2";
        }}
        alt="DIBUZZ DIGITAL PRIVATE LIMITED"
        className={`${heightClasses[size] || heightClasses.normal} w-auto object-contain transition-all duration-300 group-hover:scale-105 rounded-md drop-shadow-xs`}
      />
    </div>
  );
}

