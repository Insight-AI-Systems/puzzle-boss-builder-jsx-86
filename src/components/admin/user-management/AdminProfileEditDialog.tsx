
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, DollarSign, User, CreditCard, Save } from 'lucide-react';
import { useMemberProfile } from '@/hooks/useMemberProfile';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface AdminProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  currentUserRole: UserRole;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export const AdminProfileEditDialog: React.FC<AdminProfileEditDialogProps> = ({
  open,
  onOpenChange,
  user,
  currentUserRole,
  onRoleChange
}) => {
  const { toast } = useToast();
  const { profile, isLoading, updateProfile, awardCredits } = useMemberProfile(user.id);
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    phone: '',
    date_of_birth: '',
    tax_id: '',
    marketing_opt_in: false,
    terms_accepted: false
  });
  
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditNote, setCreditNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAwardingCredits, setIsAwardingCredits] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        tax_id: profile.tax_id || '',
        marketing_opt_in: profile.marketing_opt_in || false,
        terms_accepted: profile.terms_accepted || false
      });
    }
  }, [profile]);

  const canAssignRole = (role: UserRole): boolean => {
    if (currentUserRole === 'super_admin') return true;
    if (currentUserRole === 'admin' && role !== 'super_admin') return true;
    return false;
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateProfile.mutateAsync(profileData);
      toast({
        title: "Profile Updated",
        description: "The member's profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update the member's profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAwardCredits = async () => {
    if (creditAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsAwardingCredits(true);
    try {
      await awardCredits.mutateAsync({
        targetUserId: user.id,
        credits: creditAmount,
        adminNote: creditNote || undefined
      });
      setCreditAmount(0);
      setCreditNote('');
      toast({
        title: "Credits Awarded",
        description: `Successfully awarded ${creditAmount} credits to ${user.display_name}.`,
      });
    } catch (error) {
      toast({
        title: "Credit Award Failed",
        description: "Failed to award credits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAwardingCredits(false);
    }
  };

  const handleRoleUpdate = (newRole: string) => {
    if (canAssignRole(newRole as UserRole)) {
      onRoleChange(user.id, newRole as UserRole);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading member profile...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Member Profile - {user.display_name}
          </DialogTitle>
          <DialogDescription>
            Manage member information, role, and credits as an administrator
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>Update member's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profileData.date_of_birth}
                  onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  value={profileData.tax_id}
                  onChange={(e) => setProfileData(prev => ({ ...prev, tax_id: e.target.value }))}
                  placeholder="Enter tax ID"
                />
              </div>

              <Button 
                onClick={handleProfileUpdate} 
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Role & Credits Management */}
          <div className="space-y-6">
            {/* Role Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Management</CardTitle>
                <CardDescription>Manage member's role and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <Badge className="block w-fit">
                    {ROLE_DEFINITIONS[user.role]?.label || user.role}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Assign New Role</Label>
                  <Select value={user.role} onValueChange={handleRoleUpdate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_DEFINITIONS).map(([roleKey, roleDef]) => (
                        <SelectItem 
                          key={roleKey} 
                          value={roleKey}
                          disabled={!canAssignRole(roleKey as UserRole)}
                        >
                          {roleDef.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Credit Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Management
                </CardTitle>
                <CardDescription>Award free credits to member</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Credits</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">{profile?.credits || user.credits || 0}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="credit_amount">Award Credits</Label>
                  <Input
                    id="credit_amount"
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter credit amount"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_note">Admin Note (optional)</Label>
                  <Textarea
                    id="credit_note"
                    value={creditNote}
                    onChange={(e) => setCreditNote(e.target.value)}
                    placeholder="Reason for awarding credits"
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={handleAwardCredits} 
                  disabled={isAwardingCredits || creditAmount <= 0}
                  className="w-full"
                  variant="outline"
                >
                  {isAwardingCredits ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Awarding Credits...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Award {creditAmount} Credits
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Member Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Member Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member ID:</span>
                  <span className="font-mono">{user.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Update:</span>
                  <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terms Accepted:</span>
                  <Badge variant={profileData.terms_accepted ? "default" : "secondary"}>
                    {profileData.terms_accepted ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marketing Opt-in:</span>
                  <Badge variant={profileData.marketing_opt_in ? "default" : "secondary"}>
                    {profileData.marketing_opt_in ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
