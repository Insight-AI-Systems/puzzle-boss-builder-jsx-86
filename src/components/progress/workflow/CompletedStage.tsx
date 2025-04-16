
import React from 'react';
import { CheckCircle } from "lucide-react";

export const CompletedStage: React.FC = () => {
  return (
    <div className="mt-6">
      <div className="bg-green-900/20 border border-green-500 rounded-md p-4 text-puzzle-white">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
          <span className="font-semibold">Task Completed Successfully!</span>
        </div>
        <p className="mt-2">
          Moving to the next task shortly...
        </p>
      </div>
    </div>
  );
};
