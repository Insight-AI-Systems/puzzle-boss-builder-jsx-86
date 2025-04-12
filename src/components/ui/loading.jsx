
import React from 'react';

/**
 * Component to display a loading spinner with customizable size and color
 */
const Loading = ({ size = "large", color = "aqua" }) => {
  const sizeClasses = {
    small: "h-8 w-8 border-2",
    medium: "h-10 w-10 border-2",
    large: "h-12 w-12 border-t-2 border-b-2"
  };
  
  const colorClasses = {
    aqua: "border-puzzle-aqua",
    gold: "border-puzzle-gold",
    burgundy: "border-puzzle-burgundy"
  };
  
  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`;
  
  return (
    <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default Loading;
