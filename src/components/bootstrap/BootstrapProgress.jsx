
import React from 'react';
import Loading from '@/components/ui/loading';
import { getCurrentStageInfo, formatElapsedTime, calculateProgress } from '@/utils/bootstrapUtils';

const BootstrapProgress = ({ currentStepIndex, stages, elapsedTime }) => {
  const currentStage = getCurrentStageInfo(stages, currentStepIndex);
  const progressPercentage = calculateProgress(currentStepIndex, stages.length);
  const formattedTime = formatElapsedTime(elapsedTime);

  return (
    <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center">
      <Loading 
        size="large" 
        color="aqua" 
        message={currentStage.description || 'Loading...'} 
      />
      
      <div className="mt-4 w-64 bg-gray-900 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-puzzle-aqua h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Stage {currentStepIndex + 1}/{stages.length} • 
        Elapsed: {formattedTime}
      </div>
    </div>
  );
};

export default BootstrapProgress;

