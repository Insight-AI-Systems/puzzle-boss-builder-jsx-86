import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ProfileLookupResult {
  success: boolean;
  profile?: any;
  error?: string;
  timestamp: string;
}

export const AuthDebugPanel: React.FC = () => {
  const { user, profile, isLoading, isAdmin, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileTest, setProfileTest] = useState<ProfileLookupResult | null>(null);
  const [isTestingProfile, setIsTestingProfile] = useState(false);

  const testProfileLookup = async () => {
    if (!user?.id) return;
    
    setIsTestingProfile(true);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setProfileTest({
        success: !error && !!profileData,
        profile: profileData,
        error: error?.message,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setProfileTest({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTestingProfile(false);
    }
  };

  useEffect(() => {
    if (user?.id && !profileTest) {
      testProfileLookup();
    }
  }, [user?.id]);

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="mb-2">
            Auth Debug {getStatusIcon(!!profile && !!user)}
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-80 max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Authentication State
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testProfileLookup}
                  disabled={isTestingProfile}
                >
                  <RefreshCw className={`h-3 w-3 ${isTestingProfile ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3 text-xs">
              {/* Clerk Status */}
              <div className="space-y-1">
                <div className="font-medium text-sm">Clerk Authentication</div>
                <div className="flex items-center justify-between">
                  <span>Signed In:</span>
                  <Badge variant={user ? "default" : "destructive"}>
                    {user ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Loading:</span>
                  <Badge variant={isLoading ? "secondary" : "default"}>
                    {isLoading ? "Yes" : "No"}
                  </Badge>
                </div>
                {user && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>User ID:</span>
                      <code className="text-xs bg-muted px-1 rounded">
                        {user.id.slice(0, 8)}...
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="text-xs truncate max-w-32">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Role (Metadata):</span>
                      <Badge variant="outline">
                        {user.publicMetadata?.role as string || 'None'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              {/* Profile Status */}
              <div className="space-y-1 border-t pt-2">
                <div className="font-medium text-sm">Profile Status</div>
                <div className="flex items-center justify-between">
                  <span>Profile Object:</span>
                  <Badge variant={profile ? "default" : "destructive"}>
                    {profile ? "Found" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Role:</span>
                  <Badge variant="outline">{userRole}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Is Admin:</span>
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {isAdmin ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {/* Profile Test Results */}
              {profileTest && (
                <div className="space-y-1 border-t pt-2">
                  <div className="font-medium text-sm">Database Profile Test</div>
                  <div className="flex items-center justify-between">
                    <span>Lookup Status:</span>
                    <Badge variant={profileTest.success ? "default" : "destructive"}>
                      {profileTest.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  {profileTest.profile && (
                    <div className="flex items-center justify-between">
                      <span>Profile UUID:</span>
                      <code className="text-xs bg-muted px-1 rounded">
                        {profileTest.profile.id.slice(0, 8)}...
                      </code>
                    </div>
                  )}
                  {profileTest.error && (
                    <div className="text-red-500 text-xs mt-1">
                      Error: {profileTest.error}
                    </div>
                  )}
                  <div className="text-muted-foreground text-xs">
                    Last test: {new Date(profileTest.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};