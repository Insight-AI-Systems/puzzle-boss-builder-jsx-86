
import React from 'react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="phaser-puzzle-error">
      <p className="text-red-400">{errorMessage}</p>
      <button 
        className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState;
