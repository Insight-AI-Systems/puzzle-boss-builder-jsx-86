import React from 'react';

/**
 * Component to display a loading spinner with customizable size and color
 * @param {Object} props - Component properties
 * @param {string} [props.size="large"] - Size of the spinner: "small", "medium", or "large"
 * @param {string} [props.color="aqua"] - Color of the spinner: "aqua", "gold", or "burgundy"
 * @param {boolean} [props.fullScreen=false] - Whether to display the spinner in full screen mode
 * @returns {JSX.Element} Loading spinner component
 */
const Loading = ({ size = "large", color = "aqua", fullScreen = false }) => {
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
  
  // Fix: Only use fullscreen container when fullScreen prop is true
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <div className={spinnerClasses}></div>
      </div>
    );
  }
  
  // Otherwise just return the spinner itself
  return <div className={spinnerClasses}></div>;
};

export default Loading;
