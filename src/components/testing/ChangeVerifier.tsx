
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VerificationResult } from '@/utils/testing/types/testTypes';
import { CheckCircle2, XCircle, Settings, AlertTriangle } from 'lucide-react';

interface ChangeVerifierProps {
  title: string;
  description: string;
  verificationFn: () => boolean | Promise<boolean>;
  onResult?: (result: VerificationResult) => void;
  autoVerify?: boolean;
  interval?: number; // In milliseconds
}

export const ChangeVerifier: React.FC<ChangeVerifierProps> = ({
  title,
  description,
  verificationFn,
  onResult,
  autoVerify = false,
  interval = 2000
}) => {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const verify = useCallback(async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const verified = await verificationFn();
      const verificationResult: VerificationResult = {
        description,
        success: verified,
        error: verified ? null : 'Verification failed'
      };
      
      setResult(verificationResult);
      
      if (onResult) {
        onResult(verificationResult);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      const verificationResult: VerificationResult = {
        description,
        success: false,
        error: errorMessage
      };
      
      setResult(verificationResult);
      
      if (onResult) {
        onResult(verificationResult);
      }
    } finally {
      setIsVerifying(false);
    }
  }, [verificationFn, description, onResult]);
  
  // Auto verify at specified intervals if enabled
  useEffect(() => {
    if (!autoVerify) return;
    
    verify();
    const timer = setInterval(verify, interval);
    
    return () => {
      clearInterval(timer);
    };
  }, [autoVerify, interval, verify]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {result && (
            <Badge variant={result.success ? 'success' : 'destructive'}>
              {result.success ? 'Verified' : 'Failed'}
            </Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          {isVerifying ? (
            <Settings className="h-12 w-12 animate-spin text-muted-foreground" />
          ) : result ? (
            result.success ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )
          ) : (
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          )}
          
          <div className="mt-4 text-center">
            {isVerifying ? (
              <p className="text-muted-foreground">Verifying...</p>
            ) : result ? (
              result.success ? (
                <p className="text-green-500 font-medium">Verification successful!</p>
              ) : (
                <>
                  <p className="text-red-500 font-medium">Verification failed</p>
                  {result.error && <p className="text-sm text-muted-foreground mt-1">{result.error}</p>}
                </>
              )
            ) : (
              <p className="text-muted-foreground">No verification performed yet</p>
            )}
            
            {error && !result && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={verify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Change'}
        </Button>
      </CardFooter>
    </Card>
  );
};
