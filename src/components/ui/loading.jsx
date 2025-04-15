
import React from 'react';

/**
 * Component to display a loading spinner with customizable size and color
 * @param {Object} props - Component properties
 * @param {string} [props.size="large"] - Size of the spinner: "small", "medium", or "large"
 * @param {string} [props.color="aqua"] - Color of the spinner: "aqua", "gold", or "burgundy"
 * @param {boolean} [props.fullScreen=false] - Whether to display the spinner in full screen mode
 * @param {string} [props.message] - Optional message to display with the spinner
 * @returns {JSX.Element} Loading spinner component
 */
const Loading = ({ 
  size = "large", 
  color = "aqua", 
  fullScreen = false,
  message = "Loading..." 
}) => {
  console.log('[Loading] Rendering loading component', { size, color, fullScreen, message });
  
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
  
  const spinnerClasses = `animate-spin rounded-full ${sizeClasses[size] || sizeClasses.large} ${colorClasses[color] || colorClasses.aqua}`;
  
  // Only use fullscreen container when fullScreen prop is true
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
        <div className={spinnerClasses}></div>
        {message && <p className="mt-4 text-puzzle-aqua animate-pulse">{message}</p>}
        <div id="loading-debug" className="hidden">
          {/* Hidden debug information that could be revealed when needed */}
          <p className="text-xs text-gray-500 mt-4">Render time: {new Date().toISOString()}</p>
        </div>
      </div>
    );
  }
  
  // Otherwise just return the spinner with optional message
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses}></div>
      {message && <p className="mt-2 text-puzzle-aqua animate-pulse text-sm">{message}</p>}
    </div>
  );
};

export default Loading;
