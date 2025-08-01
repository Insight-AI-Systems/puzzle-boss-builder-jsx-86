import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
}

export function ErrorDisplay({ error, title = "Error" }: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>{title}:</strong> {errorMessage}
      </AlertDescription>
    </Alert>
  );
}

export default ErrorDisplay;