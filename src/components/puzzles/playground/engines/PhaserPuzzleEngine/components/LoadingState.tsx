
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="phaser-puzzle-loading">
      <div className="spinner"></div>
      <p>Loading puzzle game...</p>
    </div>
  );
};

export default LoadingState;
