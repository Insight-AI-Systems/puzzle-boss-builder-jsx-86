
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MemberDetailedProfile, UserMembershipDetail } from '@/types/memberTypes';
import { Separator } from "@/components/ui/separator";
import { format, isPast, addDays } from 'date-fns';
import { AlertCircle, CheckCircle, AlertTriangle, CreditCard, Calendar, DollarSign, History, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ProfileMembershipTabProps {
  profile: MemberDetailedProfile;
  membershipDetails?: UserMembershipDetail;
}

export function ProfileMembershipTab({ profile, membershipDetails }: ProfileMembershipTabProps) {
  const [autoRenewal, setAutoRenewal] = React.useState(membershipDetails?.auto_renew || false);

  const getMembershipStatusColor = () => {
    if (!membershipDetails) return 'bg-gray-500';
    
    switch (membershipDetails.status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'canceled': return 'bg-orange-500';
      case 'suspended': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getMembershipStatusIcon = () => {
    if (!membershipDetails) return <AlertCircle className="h-5 w-5" />;
    
    switch (membershipDetails.status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'canceled': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'suspended': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const isNearExpiry = () => {
    if (!membershipDetails || !membershipDetails.end_date) return false;
    
    const endDate = new Date(membershipDetails.end_date);
    const thirtyDaysFromNow = addDays(new Date(), 30);
    
    return isPast(endDate) || endDate <= thirtyDaysFromNow;
  };

  const handleRenewMembership = () => {
    console.log('Renew membership');
  };

  const handleCancelMembership = () => {
    console.log('Cancel membership');
  };

  const handleUpgradeMembership = () => {
    console.log('Upgrade membership');
  };

  if (!membershipDetails) {
    return (
      <div className="space-y-6">
        <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <AlertCircle className="h-12 w-12 text-puzzle-white/50" />
            <h3 className="text-puzzle-white text-lg font-medium">No Active Membership</h3>
            <p className="text-puzzle-white/70 text-center max-w-md">
              You don't have an active membership yet. Become a member to get access to exclusive puzzles and prizes.
            </p>
            <Button className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
              <CreditCard className="mr-2 h-4 w-4" />
              Join Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Membership Status Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-puzzle-white flex items-center gap-2">
                {getMembershipStatusIcon()}
                Membership Status
              </CardTitle>
              <CardDescription className="text-puzzle-white/70">
                Current membership details and benefits
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMembershipStatusColor()}`}>
              {membershipDetails.status.charAt(0).toUpperCase() + membershipDetails.status.slice(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-puzzle-white/70 text-sm">Start Date</label>
                <p className="text-puzzle-white font-medium">
                  {format(new Date(membershipDetails.start_date), 'PPP')}
                </p>
              </div>
              
              {membershipDetails.end_date && (
                <div>
                  <label className="text-puzzle-white/70 text-sm">End Date</label>
                  <p className={`font-medium ${isNearExpiry() ? 'text-yellow-400' : 'text-puzzle-white'}`}>
                    {format(new Date(membershipDetails.end_date), 'PPP')}
                    {isNearExpiry() && (
                      <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        Expires Soon
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-puzzle-white/70 text-sm">Membership ID</label>
                <p className="text-puzzle-white font-mono text-sm">
                  {membershipDetails.id.slice(0, 8)}...
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-puzzle-white/70 text-sm">Auto Renewal</label>
                  <p className="text-puzzle-white text-sm">
                    Automatically renew membership
                  </p>
                </div>
                <Switch
                  checked={autoRenewal}
                  onCheckedChange={setAutoRenewal}
                />
              </div>
            </div>
          </div>

          {membershipDetails.notes && (
            <div>
              <label className="text-puzzle-white/70 text-sm">Notes</label>
              <p className="text-puzzle-white/80 text-sm mt-1">
                {membershipDetails.notes}
              </p>
            </div>
          )}

          <Separator className="border-puzzle-aqua/20" />

          <div className="flex flex-wrap gap-3">
            {membershipDetails.status === 'active' && (
              <>
                <Button 
                  onClick={handleUpgradeMembership}
                  className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
                <Button 
                  onClick={handleCancelMembership}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Cancel Membership
                </Button>
              </>
            )}
            
            {(membershipDetails.status === 'expired' || membershipDetails.status === 'canceled') && (
              <Button 
                onClick={handleRenewMembership}
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Renew Membership
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Membership Benefits */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-puzzle-gold" />
            Membership Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Unlimited puzzle access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Priority customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Exclusive member puzzles</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Higher prize pools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Early access to new features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-puzzle-white text-sm">Member-only tournaments</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      {profile.financial_summary && (
        <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-puzzle-gold" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-puzzle-white/70 text-sm">Total Spent</p>
                <p className="text-puzzle-gold text-lg font-bold">
                  ${profile.financial_summary.total_spend.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-puzzle-white/70 text-sm">Total Prizes</p>
                <p className="text-green-400 text-lg font-bold">
                  ${profile.financial_summary.total_prizes.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-puzzle-white/70 text-sm">Membership Revenue</p>
                <p className="text-puzzle-aqua text-lg font-bold">
                  ${profile.financial_summary.membership_revenue.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-puzzle-white/70 text-sm">Lifetime Value</p>
                <p className="text-puzzle-white text-lg font-bold">
                  ${profile.financial_summary.lifetime_value.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
