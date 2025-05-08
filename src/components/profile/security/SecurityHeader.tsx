
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from 'lucide-react';

interface SecurityHeaderProps {
  error: string | null;
  successMessage: string | null;
}

export function SecurityHeader({ error, successMessage }: SecurityHeaderProps) {
  if (!error && !successMessage) return null;
  
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="mb-4 bg-green-900/30 border-green-500">
          <Info className="h-4 w-4 text-green-500" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
