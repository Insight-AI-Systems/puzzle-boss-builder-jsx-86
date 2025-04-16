
import React, { useState } from 'react';
import { TestRunner, VerificationResult } from '@/utils/testRunner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, AlertCircle, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChangeVerifierProps {
  changeId: string;
  description: string;
  onVerificationComplete?: (result: VerificationResult) => void;
  autoVerify?: boolean;
}

export const ChangeVerifier: React.FC<ChangeVerifierProps> = ({ 
  changeId, 
  description, 
  onVerificationComplete,
  autoVerify = false
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  
  React.useEffect(() => {
    if (autoVerify) {
      handleVerify();
    }
  }, [autoVerify]);
  
  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const verificationResult = await TestRunner.verifyChange(changeId, description);
      setResult(verificationResult);
      
      if (onVerificationComplete) {
        onVerificationComplete(verificationResult);
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      const errorResult: VerificationResult = {
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        changeId,
        description
      };
      
      setResult(errorResult);
      
      if (onVerificationComplete) {
        onVerificationComplete(errorResult);
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const getStatusIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case 'VERIFIED':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'PARTIAL':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = () => {
    if (!result) return null;
    
    let className = '';
    
    switch (result.status) {
      case 'VERIFIED':
        className = 'bg-green-100 text-green-800';
        break;
      case 'PARTIAL':
        className = 'bg-yellow-100 text-yellow-800';
        break;
      case 'FAILED':
        className = 'bg-red-100 text-red-800';
        break;
      case 'SKIPPED':
        className = 'bg-gray-100 text-gray-800';
        break;
    }
    
    return (
      <Badge className={className}>
        {result.status}
      </Badge>
    );
  };
  
  return (
    <Card className="bg-puzzle-black/50 border-puzzle-aqua/20 mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-puzzle-white text-sm font-medium">Change Verification</CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-puzzle-white/80 text-sm">{description}</p>
          
          {result && (
            <div className="mt-2 flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-puzzle-white text-sm">{result.message}</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Play className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Verify Change
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
