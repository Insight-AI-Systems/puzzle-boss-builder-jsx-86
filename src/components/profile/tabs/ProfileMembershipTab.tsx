
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Calendar, CreditCard, Star } from 'lucide-react';

interface ProfileMembershipTabProps {
  profile: any;
  membershipDetails?: any;
}

export const ProfileMembershipTab: React.FC<ProfileMembershipTabProps> = ({ 
  profile, 
  membershipDetails 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge variant="default">Free Player</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Member Since</span>
            <span className="text-sm text-gray-500">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Credits Remaining</span>
            <span className="font-medium">{profile?.credits || 0}</span>
          </div>

          <Button className="w-full">
            <Star className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Membership History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No membership history</h3>
            <p className="text-gray-500">Your membership activity will appear here</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Access to free puzzles</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Premium puzzles (upgrade required)</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Priority support (upgrade required)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
