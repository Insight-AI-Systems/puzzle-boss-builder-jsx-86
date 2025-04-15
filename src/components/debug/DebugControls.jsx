
import React from 'react';

const DebugControls = ({ onToggleExpand, onClearConsole, isExpanded }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold text-puzzle-aqua">
        Puzzle Boss Debug Panel
      </h2>
      <div className="flex gap-2">
        <button 
          onClick={onClearConsole} 
          className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
        >
          Clear Console
        </button>
        <button 
          onClick={onToggleExpand} 
          className="px-2 py-1 bg-puzzle-aqua/30 text-white rounded"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>
  );
};

export default DebugControls;
