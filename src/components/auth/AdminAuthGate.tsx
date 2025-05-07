
import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEnhancedAuthContext } from '@/contexts/EnhancedAuthContext';

interface AdminAuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireMfa?: boolean;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ 
  children, 
  fallback = null,
  requireMfa = false
}) => {
  const { user, verifyAdminAccess, requireMfaForAdmin } = useEnhancedAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // MFA specific states
  const [mfaRequired, setMfaRequired] = useState<boolean>(false);
  const [mfaVerified, setMfaVerified] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>('');
  const [verifyingMfa, setVerifyingMfa] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Check admin role first
        const adminAccess = await verifyAdminAccess();
        setIsAdmin(adminAccess);
        
        // If admin and MFA is required, check MFA status
        if (adminAccess && requireMfa) {
          const mfaStatus = await requireMfaForAdmin();
          setMfaRequired(mfaStatus.mfaRequired);
          setMfaVerified(mfaStatus.mfaVerified);
        }
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError('Failed to verify admin access');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminAccess();
  }, [user, verifyAdminAccess, requireMfa, requireMfaForAdmin]);
  
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mfaCode.trim()) {
      setError('Please enter a verification code');
      return;
    }
    
    try {
      setVerifyingMfa(true);
      setError(null);
      
      const mfaStatus = await requireMfaForAdmin(mfaCode);
      setMfaVerified(mfaStatus.mfaVerified);
      
      if (!mfaStatus.mfaVerified) {
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error('MFA verification error:', err);
      setError('Failed to verify MFA code');
    } finally {
      setVerifyingMfa(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !mfaRequired) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // Show MFA form if required but not yet verified
  if (isAdmin && mfaRequired && !mfaVerified) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <div className="bg-puzzle-aqua/20 p-3 rounded-full w-fit mx-auto mb-4">
            <Lock className="h-6 w-6 text-puzzle-aqua" />
          </div>
          <CardTitle className="text-center">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Please enter the verification code from your authenticator app
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleMfaSubmit}>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter verification code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={verifyingMfa}
            >
              {verifyingMfa && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
  
  // Admin with verified MFA or no MFA required
  if (isAdmin && (!mfaRequired || mfaVerified)) {
    return <>{children}</>;
  }
  
  // Not admin, show fallback
  return <>{fallback}</>;
};
