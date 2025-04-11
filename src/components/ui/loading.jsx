
import React from 'react';

/**
 * Component to display a loading spinner
 */
const Loading = () => {
  return (
    <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
    </div>
  );
};

export default Loading;
