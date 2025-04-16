
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, PauseCircle } from "lucide-react";

interface TestingStageProps {
  onComplete: (success: boolean) => void;
}

export const TestingStage: React.FC<TestingStageProps> = ({ onComplete }) => {
  return (
    <div className="mt-6">
      <h4 className="text-md font-medium text-puzzle-white mb-2">Testing</h4>
      <div className="bg-puzzle-black/30 border border-puzzle-aqua/20 rounded-md p-4 text-puzzle-white">
        <div className="flex items-center">
          <PauseCircle className="h-6 w-6 text-blue-500 mr-2" />
          <span>Testing phase...</span>
        </div>
        <p className="mt-2">
          Please verify that the implementation meets all requirements. Is it working as expected?
        </p>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={() => onComplete(false)}>
          <XCircle className="w-4 h-4 mr-2" />
          Failed
        </Button>
        <Button onClick={() => onComplete(true)}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Passed
        </Button>
      </div>
    </div>
  );
};
