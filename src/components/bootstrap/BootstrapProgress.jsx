
import React from 'react';
import Loading from '@/components/ui/loading';

const BootstrapProgress = ({ currentStepIndex, stages, elapsedTime }) => (
  <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
    <Loading 
      size="large" 
      color="aqua" 
      message={stages[currentStepIndex]?.description || 'Loading...'} 
    />
    
    <div className="mt-4 w-64 bg-gray-900 rounded-full h-2.5 overflow-hidden">
      <div 
        className="bg-puzzle-aqua h-2.5 rounded-full" 
        style={{ width: `${(currentStepIndex / (stages.length - 1)) * 100}%` }}
      ></div>
    </div>
    
    <div className="mt-2 text-xs text-gray-500">
      Stage {currentStepIndex + 1}/{stages.length} • 
      Elapsed: {Math.round(elapsedTime / 100) / 10}s
    </div>
  </div>
);

export default BootstrapProgress;
