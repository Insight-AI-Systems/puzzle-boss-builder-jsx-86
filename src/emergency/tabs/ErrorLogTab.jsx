
import React from 'react';

const ErrorLogTab = ({ diagnosticData, clearErrors }) => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Error Log</h2>
      {diagnosticData.errors.length === 0 ? (
        <p className="text-gray-500">No errors recorded yet.</p>
      ) : (
        <div className="bg-black/40 rounded p-2 max-h-[400px] overflow-y-auto">
          {diagnosticData.errors.map((error, index) => (
            <div key={index} className="p-3 border-b border-gray-800 whitespace-pre-wrap break-words">
              <div className="text-xs text-gray-500 mb-1">{error.timestamp}</div>
              <div className="text-red-400">{error.message}</div>
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={clearErrors}
        className="mt-4 px-4 py-2 bg-puzzle-burgundy text-white rounded hover:bg-puzzle-burgundy/80"
      >
        Clear Error Log
      </button>
    </div>
  );
};

export default ErrorLogTab;
