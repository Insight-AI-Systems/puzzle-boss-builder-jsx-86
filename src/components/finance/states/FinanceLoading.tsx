
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function FinanceLoading() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-semibold">Loading Financial Data</h3>
        <p className="text-muted-foreground mt-1">
          Please wait while we retrieve your financial information...
        </p>
      </CardContent>
    </Card>
  );
}
