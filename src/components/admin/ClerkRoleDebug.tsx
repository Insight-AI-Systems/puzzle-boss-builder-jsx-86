
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Shield, ExternalLink } from "lucide-react";
import { useAuth, useOrganization, useUser } from '@clerk/clerk-react';
import { useClerkRoles } from '@/hooks/useClerkRoles';

export const ClerkRoleDebug: React.FC = () => {
  const { user } = useUser();
  const { organization, membership } = useOrganization();
  const { userRole, hasRole, isAdmin, hasPermission } = useClerkRoles();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAlanInsight = userEmail === 'alan@insight-ai-systems.com';

  return (
    <Card className="border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Clerk RBAC Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Current User Status (Clerk RBAC)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-mono">{userEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clerk Role</p>
              <Badge variant={userRole === 'super_admin' ? 'default' : userRole === 'admin' ? 'secondary' : 'outline'}>
                {userRole}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {isAdmin ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Is Admin</span>
            </div>
            <div className="flex items-center gap-2">
              {hasRole('super_admin') ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Super Admin</span>
            </div>
            <div className="flex items-center gap-2">
              {hasPermission('manage_users') ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Manage Users</span>
            </div>
          </div>
        </div>

        {/* Organization Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Organization Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-mono">{organization?.name || 'None'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membership Role</p>
              <Badge variant={membership?.role ? 'default' : 'outline'}>
                {membership?.role || 'No membership'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!organization && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Organization Not Found</strong></p>
                <p>You need to set up an organization in Clerk to use role-based access.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
                  className="mt-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Clerk Dashboard
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {organization && !membership && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>No Organization Membership</strong></p>
                <p>You are not a member of the organization. Ask an admin to invite you.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {organization && membership && membership.role === 'basic_member' && isAlanInsight && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Role Assignment Needed</strong></p>
                <p>You have basic membership but need super_admin role assigned in Clerk.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
                  className="mt-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Assign Role in Clerk
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success State */}
        {organization && membership && membership.role !== 'basic_member' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ✅ Clerk RBAC is properly configured. Role: {membership.role}
            </AlertDescription>
          </Alert>
        )}

        {/* Setup Instructions */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Setup Steps for Clerk RBAC:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to Clerk Dashboard → Organizations → Enable Organizations</li>
                <li>Create organization "PuzzleBoss Admin"</li>
                <li>Add custom roles: super_admin, admin, category_manager, etc.</li>
                <li>Invite alan@insight-ai-systems.com with super_admin role</li>
                <li>Configure permissions for each role</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
