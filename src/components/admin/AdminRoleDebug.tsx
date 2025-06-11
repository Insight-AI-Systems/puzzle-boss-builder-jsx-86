
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { ensureAlanHasSuperAdminRole, removeAlanBoothAdminAccess } from '@/utils/admin/updateUserRole';
import { useToast } from '@/hooks/use-toast';

export const AdminRoleDebug: React.FC = () => {
  const { user, profile, userRole, hasRole, isAdmin } = useClerkAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const handleEnsureAlanAdmin = async () => {
    setIsUpdating(true);
    try {
      const result = await ensureAlanHasSuperAdminRole();
      if (result.success) {
        toast({
          title: "Success",
          description: "Alan's super_admin role has been verified/set",
        });
        // Refresh the page to update auth state
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to set Alan's super_admin role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveAlanBoothAdmin = async () => {
    setIsUpdating(true);
    try {
      const result = await removeAlanBoothAdminAccess();
      if (result.success) {
        toast({
          title: "Success",
          description: "alantbooth@xtra.co.nz admin access has been removed",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove admin access",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const isAlanInsight = userEmail === 'alan@insight-ai-systems.com';
  const isAlanBooth = userEmail === 'alantbooth@xtra.co.nz';
  const shouldHaveAdminAccess = isAlanInsight;
  const shouldNotHaveAdminAccess = isAlanBooth;

  return (
    <Card className="border-yellow-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Role Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Current User Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-mono">{userEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Database Role</p>
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
              {hasRole('admin') ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </div>

        {/* Role Verification Alerts */}
        {isAlanInsight && (
          <Alert variant={userRole === 'super_admin' ? 'default' : 'destructive'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {userRole === 'super_admin' 
                ? "✅ Correct: alan@insight-ai-systems.com has super_admin role"
                : "❌ Issue: alan@insight-ai-systems.com should have super_admin role but currently has: " + userRole
              }
            </AlertDescription>
          </Alert>
        )}

        {isAlanBooth && (
          <Alert variant={userRole === 'player' ? 'default' : 'destructive'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {userRole === 'player' 
                ? "✅ Correct: alantbooth@xtra.co.nz has player role (no admin access)"
                : "❌ Issue: alantbooth@xtra.co.nz should NOT have admin access but currently has: " + userRole
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Actions */}
        {isAlanInsight && (
          <div className="space-y-2">
            <h4 className="font-medium">Admin Actions</h4>
            <div className="flex gap-2">
              {userRole !== 'super_admin' && (
                <Button 
                  onClick={handleEnsureAlanAdmin}
                  disabled={isUpdating}
                  variant="default"
                >
                  Fix My Super Admin Role
                </Button>
              )}
              
              <Button 
                onClick={handleRemoveAlanBoothAdmin}
                disabled={isUpdating}
                variant="outline"
              >
                Remove alantbooth@xtra.co.nz Admin Access
              </Button>
            </div>
          </div>
        )}

        {/* Security Note */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Security Status: All admin access is now based solely on database roles. 
            No hardcoded email lists are used for admin privileges.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
