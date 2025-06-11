
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, MapPin, Calendar, Crown } from 'lucide-react';
import { useMemberProfile } from '@/hooks/useMemberProfile';

const ProfileInfoTab: React.FC = () => {
  const { profile, isLoading } = useMemberProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mock data for display
  const displayProfile = {
    username: profile?.username || 'Anonymous User',
    email: profile?.email || 'user@example.com',
    role: profile?.role || 'player',
    location: profile?.location || 'Not specified',
    joinDate: profile?.created_at || new Date().toISOString(),
    lastActive: profile?.last_sign_in || new Date().toISOString(),
    isAdmin: ['admin', 'super_admin'].includes(profile?.role || '')
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-puzzle-aqua to-puzzle-purple rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{displayProfile.username}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={displayProfile.isAdmin ? 'default' : 'secondary'}>
                    {displayProfile.role}
                  </Badge>
                  {displayProfile.isAdmin && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{displayProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{displayProfile.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Joined {new Date(displayProfile.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Last active {new Date(displayProfile.lastActive).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Notifications</span>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Privacy Settings</span>
            <Badge variant="secondary">Public</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Account Status</span>
            <Badge variant="default">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfoTab;
