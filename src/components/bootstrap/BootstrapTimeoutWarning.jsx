
import React from 'react';
import Loading from '@/components/ui/loading';

const BootstrapTimeoutWarning = ({ 
  loadingStage, 
  loadingSteps, 
  currentStepIndex, 
  elapsedTime,
  stages,
  onContinue,
  onSwitchToMinimal 
}) => (
  <div className="min-h-screen bg-puzzle-black flex flex-col items-center justify-center p-4">
    <div className="max-w-md p-6 bg-black/30 rounded-lg border border-puzzle-gold text-center">
      <h2 className="text-xl text-puzzle-gold mb-4">Loading Taking Too Long</h2>
      <p className="text-white mb-4">The application is taking longer than expected to load.</p>
      
      <div className="flex items-center justify-center mb-4">
        <Loading size="medium" color="aqua" message={`Still loading ${loadingStage}...`} />
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        Current stage: {stages[currentStepIndex]?.description || loadingStage}<br />
        Elapsed: {Math.round(elapsedTime / 100) / 10}s
      </div>
      
      <div className="mb-4 max-h-24 overflow-y-auto text-left bg-black/50 p-2 rounded">
        <h3 className="text-xs font-bold text-puzzle-aqua mb-1">Loading Progress:</h3>
        {loadingSteps.map((step, i) => (
          <div key={i} className="text-xs text-gray-400">
            <span className="opacity-70">[{Math.round(step.timeFromStart / 10) / 100}s]</span>{' '}
            <span className="text-puzzle-aqua">{step.stage}</span>:{' '}
            <span className={step.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
              {step.status}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          className="w-full bg-puzzle-gold text-black px-4 py-2 rounded"
          onClick={onContinue}
        >
          Continue Anyway
        </button>
        <button
          className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
          onClick={onSwitchToMinimal}
        >
          Try Minimal Mode
        </button>
      </div>
    </div>
  </div>
);

export default BootstrapTimeoutWarning;
