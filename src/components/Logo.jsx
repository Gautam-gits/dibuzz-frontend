import React from 'react';

export function Logo({ variant = "full", size = "normal", className = "" }) {
  const heightClasses = {
    small: "h-9 sm:h-10",
    normal: "h-11 sm:h-13 max-h-14",
    large: "h-14 sm:h-16",
    xlarge: "h-20 sm:h-24"
  };

  return (
    <div className={`flex items-center cursor-pointer select-none group ${className}`}>
      <img
        src="/logo.jpeg"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/logo.png";
        }}
        alt="DIBUZZ DIGITAL PRIVATE LIMITED"
        className={`${heightClasses[size] || heightClasses.normal} w-auto object-contain transition-all duration-300 group-hover:scale-105 rounded-md drop-shadow-xs`}
      />
    </div>
  );
}

