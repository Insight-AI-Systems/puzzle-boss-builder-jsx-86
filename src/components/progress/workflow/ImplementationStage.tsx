
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

interface ImplementationStageProps {
  onComplete: () => void;
}

export const ImplementationStage: React.FC<ImplementationStageProps> = ({ onComplete }) => {
  return (
    <div className="mt-6">
      <h4 className="text-md font-medium text-puzzle-white mb-2">Implementation</h4>
      <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white">
        <div className="flex items-center">
          <PlayCircle className="h-6 w-6 text-amber-500 mr-2" />
          <span>Implementation in progress...</span>
        </div>
        <p className="mt-2">The team is currently implementing the approved solution.</p>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={onComplete}>
          Mark Implementation Complete
        </Button>
      </div>
    </div>
  );
};
