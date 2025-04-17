
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  centered?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'puzzle-aqua',
  centered = true,
  message
}) => {
  // Size mappings
  const sizeMap = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3'
  };

  const containerClasses = centered 
    ? 'flex flex-col items-center justify-center min-h-40' 
    : 'flex flex-col items-center';

  return (
    <div className={containerClasses}>
      <div 
        className={`${sizeMap[size]} rounded-full border-t-${color} animate-spin`}
        style={{ 
          borderTopColor: `var(--${color}, #36D1DC)`,
          borderLeftColor: `var(--${color}, #36D1DC)`,
          opacity: 0.7,
          borderRightColor: "transparent",
          borderBottomColor: "transparent"
        }}
      />
      {message && (
        <p className="mt-3 text-sm text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
