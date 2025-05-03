
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MemberDetailedProfile, XeroUserMapping } from '@/types/memberTypes';
import { Button } from "@/components/ui/button";
import { Link2, Link2Off, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useXeroMemberSync } from '@/hooks/useXeroMemberSync';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfileXeroTabProps {
  profile: MemberDetailedProfile;
  xeroMapping?: XeroUserMapping;
}

export function ProfileXeroTab({ profile, xeroMapping }: ProfileXeroTabProps) {
  const { 
    syncMemberToXero, 
    unlinkFromXero, 
    syncInProgress, 
    error
  } = useXeroMemberSync();

  const handleSync = () => {
    syncMemberToXero.mutate(profile);
  };

  const handleUnlink = () => {
    if (profile.id) {
      unlinkFromXero.mutate(profile.id);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-puzzle-white">Xero Integration</CardTitle>
          <CardDescription className="text-puzzle-white/70">
            Connect your profile with Xero for invoicing and financial management
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {xeroMapping ? (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Link2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-400">Connected to Xero</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500/50 text-red-500 hover:bg-red-900/20"
                  onClick={handleUnlink}
                  disabled={unlinkFromXero.isPending}
                >
                  {unlinkFromXero.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      Unlinking...
                    </>
                  ) : (
                    <>
                      <Link2Off className="h-4 w-4 mr-2" /> 
                      Unlink from Xero
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-puzzle-white/70">Xero Contact ID</span>
                  <span className="text-puzzle-white font-mono text-sm">{xeroMapping.xero_contact_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-puzzle-white/70">Status</span>
                  <span className="text-puzzle-white capitalize">{xeroMapping.sync_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-puzzle-white/70">Last Synced</span>
                  <span className="text-puzzle-white">{format(new Date(xeroMapping.last_synced), 'MMMM dd, yyyy h:mm a')}</span>
                </div>

                <div className="mt-4">
                  <Button 
                    className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                    onClick={handleSync}
                    disabled={syncInProgress}
                  >
                    {syncInProgress ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 mr-2" />
                        Sync with Xero
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="ghost" 
                  className="text-puzzle-aqua hover:text-puzzle-aqua/70 hover:bg-transparent p-0"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span>View in Xero</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Link2Off className="h-12 w-12 text-puzzle-white/50" />
              <h3 className="text-puzzle-white text-lg font-medium">Not Connected to Xero</h3>
              <p className="text-puzzle-white/70 text-center max-w-md">
                Connect your account to Xero for streamlined invoicing and financial management.
              </p>
              <Button 
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                onClick={handleSync}
                disabled={syncInProgress}
              >
                {syncInProgress ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect to Xero
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-puzzle-white">Xero Information</CardTitle>
          <CardDescription className="text-puzzle-white/70">
            Data that will be synchronized with Xero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-puzzle-white/70 text-sm">Full Name</span>
                <p className="text-puzzle-white">{profile.full_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-puzzle-white/70 text-sm">Email</span>
                <p className="text-puzzle-white">{profile.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-puzzle-white/70 text-sm">Phone</span>
                <p className="text-puzzle-white">{profile.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-puzzle-white/70 text-sm">Tax ID</span>
                <p className="text-puzzle-white">{profile.tax_id || 'Not provided'}</p>
              </div>
            </div>
            
            <div>
              <span className="text-puzzle-white/70 text-sm">Address</span>
              <p className="text-puzzle-white">
                {profile.address_line1 
                  ? `${profile.address_line1}${profile.address_line2 ? ', ' + profile.address_line2 : ''}, ${profile.city || ''}, ${profile.state || ''} ${profile.postal_code || ''}, ${profile.country || ''}` 
                  : 'No address provided'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
