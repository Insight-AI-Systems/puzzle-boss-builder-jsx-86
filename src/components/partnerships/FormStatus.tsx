
import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FormStatusProps {
  error: string | null;
  success: string | null;
}

const FormStatus: React.FC<FormStatusProps> = ({ error, success }) => {
  if (!error && !success) return null;

  if (error) {
    return (
      <div className="bg-destructive/10 p-3 rounded-md mb-6 flex items-start">
        <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-500/10 p-3 rounded-md mb-6 flex items-start">
        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-green-500">{success}</p>
      </div>
    );
  }

  return null;
};

export default FormStatus;
