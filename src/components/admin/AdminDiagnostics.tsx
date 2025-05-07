
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, Check, X } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Admin Diagnostics Component
 * 
 * A troubleshooting tool to help diagnose admin access issues
 */
export function AdminDiagnostics() {
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();
  const { profile } = useUserProfile();

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Check authentication status
      const authCheck = {
        isAuthenticated: !!user,
        userId: user?.id || 'Not authenticated',
        userEmail: user?.email || 'Not authenticated',
        emailMatches: isProtectedAdmin(user?.email),
        sessionExists: !!session,
      };

      // Check profile data
      const profileCheck = {
        profileExists: !!profile,
        profileId: profile?.id || 'No profile found',
        profileRole: profile?.role || 'No role found',
      };

      // Test edge function access
      let edgeFunctionCheck = { success: false, message: 'Not attempted', data: null };
      try {
        const { data, error } = await supabase.functions.invoke('get-all-users', {
          method: 'GET',
        });
        
        edgeFunctionCheck = {
          success: !error && Array.isArray(data),
          message: error ? `Error: ${error.message}` : `Success: Retrieved ${data?.length || 0} users`,
          data: data ? { userCount: data.length } : null,
        };
      } catch (err) {
        edgeFunctionCheck = {
          success: false,
          message: `Exception: ${err instanceof Error ? err.message : String(err)}`,
          data: null,
        };
      }

      // Direct database test (using RLS)
      let databaseCheck = { success: false, message: 'Not attempted', data: null };
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count(*)', { count: 'exact', head: true });

        databaseCheck = {
          success: !error,
          message: error ? `Error: ${error.message}` : `Success: Database accessible`,
          data: data,
        };
      } catch (err) {
        databaseCheck = {
          success: false,
          message: `Exception: ${err instanceof Error ? err.message : String(err)}`,
          data: null,
        };
      }

      // Compile all checks
      const diagnostics = {
        timestamp: new Date().toISOString(),
        auth: authCheck,
        profile: profileCheck,
        edgeFunction: edgeFunctionCheck,
        database: databaseCheck,
      };
      
      setDiagnosticData(diagnostics);
      debugLog('AdminDiagnostics', 'Diagnostics completed', DebugLevel.INFO, diagnostics);
      
    } catch (error) {
      debugLog('AdminDiagnostics', 'Error running diagnostics', DebugLevel.ERROR, { error });
      setDiagnosticData({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run diagnostics on mount
    runDiagnostics();
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Admin Access Diagnostics</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostics} 
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </CardTitle>
        <CardDescription>
          Troubleshooting tool to diagnose admin access issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {diagnosticData?.error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error running diagnostics</AlertTitle>
            <AlertDescription>{diagnosticData.error}</AlertDescription>
          </Alert>
        ) : diagnosticData ? (
          <div className="space-y-4">
            {/* Authentication Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Authentication:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>Authenticated:</span>
                  {diagnosticData.auth.isAuthenticated ? 
                    <Check className="text-green-500 h-4 w-4" /> : 
                    <X className="text-red-500 h-4 w-4" />}
                </div>
                <div>User ID: <span className="font-mono text-xs">{diagnosticData.auth.userId.substring(0, 8)}...</span></div>
                <div className="flex items-center gap-2">
                  <span>Email:</span>
                  <span className="text-xs">{diagnosticData.auth.userEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Protected Admin Email Match:</span>
                  {diagnosticData.auth.emailMatches ? 
                    <Check className="text-green-500 h-4 w-4" /> : 
                    <X className="text-red-500 h-4 w-4" />}
                </div>
              </div>
            </div>

            {/* Profile Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Profile:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>Profile Exists:</span>
                  {diagnosticData.profile.profileExists ? 
                    <Check className="text-green-500 h-4 w-4" /> : 
                    <X className="text-red-500 h-4 w-4" />}
                </div>
                <div>Role: <Badge variant={diagnosticData.profile.profileRole ? "default" : "outline"}>{diagnosticData.profile.profileRole}</Badge></div>
              </div>
            </div>

            {/* Edge Function Test */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Edge Function Access:</h3>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {diagnosticData.edgeFunction.success ? 
                  <Badge className="bg-green-600">Success</Badge> : 
                  <Badge variant="destructive">Failed</Badge>}
              </div>
              <div className="text-xs">{diagnosticData.edgeFunction.message}</div>
              {diagnosticData.edgeFunction.data?.userCount !== undefined && (
                <div className="text-xs">Users returned: {diagnosticData.edgeFunction.data.userCount}</div>
              )}
            </div>

            {/* Database Access Test */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Database Access:</h3>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                {diagnosticData.database.success ? 
                  <Badge className="bg-green-600">Success</Badge> : 
                  <Badge variant="destructive">Failed</Badge>}
              </div>
              <div className="text-xs">{diagnosticData.database.message}</div>
            </div>

            {/* Admin Check Summary */}
            <Alert className={`${(diagnosticData.auth.emailMatches || diagnosticData.profile.profileRole === 'super_admin' || diagnosticData.profile.profileRole === 'admin') ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                <span>Admin Status:</span>
                {(diagnosticData.auth.emailMatches || diagnosticData.profile.profileRole === 'super_admin' || diagnosticData.profile.profileRole === 'admin') ? (
                  <Badge className="bg-green-600">Admin Access Confirmed</Badge>
                ) : (
                  <Badge variant="destructive">Not An Admin</Badge>
                )}
              </div>
              <AlertDescription className="mt-2">
                {(diagnosticData.auth.emailMatches || diagnosticData.profile.profileRole === 'super_admin' || diagnosticData.profile.profileRole === 'admin') ? (
                  <span>You have admin privileges.</span>
                ) : (
                  <div>
                    <p>You do not appear to have admin privileges. This could be due to:</p>
                    <ul className="list-disc list-inside mt-2 pl-2">
                      <li>Your email does not match the protected admin email</li>
                      <li>Your profile does not have an admin role</li>
                      <li>Edge function authentication issues</li>
                      <li>Database permission issues</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Running diagnostics...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
