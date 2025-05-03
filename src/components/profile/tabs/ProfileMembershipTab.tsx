
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MemberDetailedProfile, UserMembershipDetail } from '@/types/memberTypes';
import { Separator } from "@/components/ui/separator";
import { format, isPast, addDays } from 'date-fns';
import { AlertCircle, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileMembershipTabProps {
  profile: MemberDetailedProfile;
  membershipDetails?: UserMembershipDetail;
}

export function ProfileMembershipTab({ profile, membershipDetails }: ProfileMembershipTabProps) {
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

  // Mock function for renewing membership
  const handleRenewMembership = () => {
    console.log('Renew membership');
  };

  if (!membershipDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-puzzle-white/50" />
        <h3 className="text-puzzle-white text-lg font-medium">No Active Membership</h3>
        <p className="text-puzzle-white/70 text-center max-w-md">
          You don't have an active membership yet. Become a member to get access to exclusive puzzles and prizes.
        </p>
        <Button className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90">
          <CreditCard className="mr-2 h-4 w-4" />
          Join Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-puzzle-black/70 border-puzzle-aqua/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-puzzle-white flex items-center">
                {getMembershipStatusIcon()}
                <span className="ml-2">Membership Status</span>
              </CardTitle>
              <CardDescription className="text-puzzle-white/70">
                Your current membership details
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-white ${getMembershipStatusColor()}`}>
              {membershipDetails.status.charAt(0).toUpperCase() + membershipDetails.status.slice(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-puzzle-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-puzzle-white/70">Start Date</p>
              <p>{format(new Date(membershipDetails.start_date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-puzzle-white/70">End Date</p>
              <p>
                {membershipDetails.end_date 
                  ? format(new Date(membershipDetails.end_date), 'MMMM dd, yyyy')
                  : 'Ongoing'}
              </p>
            </div>
          </div>
          
          <Separator className="my-4 bg-puzzle-aqua/20" />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-puzzle-white/70">Auto-renew</p>
              <p>{membershipDetails.auto_renew ? 'Enabled' : 'Disabled'}</p>
            </div>

            {isNearExpiry() && membershipDetails.status === 'active' && (
              <div className="bg-yellow-900/30 border border-yellow-500/30 rounded p-3 mt-4">
                <p className="text-yellow-300 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Your membership is expiring soon.
                </p>
                {!membershipDetails.auto_renew && (
                  <Button 
                    className="mt-2 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                    onClick={handleRenewMembership}
                  >
                    Renew Membership
                  </Button>
                )}
              </div>
            )}
            
            {membershipDetails.status === 'expired' && (
              <div className="bg-red-900/30 border border-red-500/30 rounded p-3 mt-4">
                <p className="text-red-300 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Your membership has expired.
                </p>
                <Button 
                  className="mt-2 bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                  onClick={handleRenewMembership}
                >
                  Renew Membership
                </Button>
              </div>
            )}
          </div>
          
          {membershipDetails.notes && (
            <>
              <Separator className="my-4 bg-puzzle-aqua/20" />
              <div>
                <p className="text-sm text-puzzle-white/70">Notes</p>
                <p className="mt-1">{membershipDetails.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
