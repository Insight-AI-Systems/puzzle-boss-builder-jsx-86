
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FinanceErrorProps {
  error: Error;
  onRetry: () => void;
}

export function FinanceError({ error, onRetry }: FinanceErrorProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold">Error Loading Financial Data</h3>
        <p className="text-muted-foreground mt-1 mb-4 text-center max-w-lg">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
