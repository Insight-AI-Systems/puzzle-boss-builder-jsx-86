
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Bug } from 'lucide-react';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/utils/constants';

export function AdminDiagnostics() {
  const { user, session, hasRole } = useAuth();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch diagnostic information
  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check current user auth status
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Auth error: ${userError.message}`);
      }
      
      setUserDetails(userData.user);
      
      // Check profile from database
      if (userData.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }
        
        setProfileDetails(profileData || null);
      }
    } catch (err) {
      console.error('Diagnostics error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Download diagnostics as JSON
  const downloadDiagnostics = () => {
    const diagnosticData = {
      timestamp: new Date().toISOString(),
      sessionExists: !!session,
      userFromContext: user ? {
        id: user.id,
        email: user.email,
        role: user.role
      } : null,
      userFromAPI: userDetails,
      profileFromDB: profileDetails,
      isProtectedAdmin: user?.email ? isProtectedAdmin(user.email) : false,
      PROTECTED_ADMIN_EMAIL,
      roles: {
        isAdmin: hasRole('admin'),
        isSuperAdmin: hasRole('super_admin'),
        isCategoryManager: hasRole('category_manager')
      }
    };
    
    const blob = new Blob([JSON.stringify(diagnosticData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-diagnostics.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Fetch on initial render
  useEffect(() => {
    fetchDiagnostics();
  }, []);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-red-500" />
          Admin Diagnostics
        </CardTitle>
        <CardDescription>
          Troubleshooting information for administrators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md">
              Error: {error}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Authorization Status</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Protected Admin:</div>
              <div>{user?.email && isProtectedAdmin(user.email) ? 'Yes' : 'No'}</div>
              
              <div className="font-medium">Session Active:</div>
              <div>{session ? 'Yes' : 'No'}</div>
              
              <div className="font-medium">User Role:</div>
              <div>{user?.role || 'Not set'}</div>
            </div>
            
            <h3 className="text-sm font-medium mt-4">Role Checks</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Is Super Admin:</div>
              <div>{hasRole('super_admin') ? 'Yes' : 'No'}</div>
              
              <div className="font-medium">Is Admin:</div>
              <div>{hasRole('admin') ? 'Yes' : 'No'}</div>
              
              <div className="font-medium">Is Category Manager:</div>
              <div>{hasRole('category_manager') ? 'Yes' : 'No'}</div>
            </div>
            
            {profileDetails && (
              <>
                <h3 className="text-sm font-medium mt-4">Profile Data</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-28">
                  {JSON.stringify({
                    id: profileDetails.id,
                    role: profileDetails.role,
                    username: profileDetails.username,
                    email: profileDetails.email
                  }, null, 2)}
                </pre>
              </>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchDiagnostics} 
              disabled={loading}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadDiagnostics}
            >
              <Download className="mr-1 h-4 w-4" />
              Download Diagnostics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
